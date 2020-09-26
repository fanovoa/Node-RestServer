const express = require('express');

const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuarioModel');
const Producto = require('../models/productoModel');

const fs = require('fs');
const path = require('path');

app.use(fileUpload({ useTempFiles: true }));


app.put('/upload/:tipo/:id', (req, res) => {

    let { tipo, id } = req.params;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningún archivo.'
            }
        });
    };

    //Valida tipo
    let tiposValidos = ['productos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo
            }
        })
    }

    let archivo = req.files.archivo;
    let nombreArchivo = archivo.name.split('.');
    let extension = nombreArchivo[nombreArchivo.length - 1];

    // Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg', 'pdf']

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        })
    }

    //Cambiar nombre al archivo
    let nombreArchivoCambio = `${ id }-${ new Date().getMilliseconds() }.${ extension }`


    archivo.mv(`uploads/${ tipo }/${ nombreArchivoCambio }`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (tipo === 'usuarios')
            imagenUsuario(id, res, nombreArchivoCambio);

        else
            imagenProducto(id, res, nombreArchivoCambio);

    })

});


const imagenUsuario = (id, res, nombreArchivo) => {

    Usuario.findById(id, async(err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        try {

            borrarArchivo(usuarioDB.img, 'usuarios');

            usuarioDB.img = nombreArchivo;
            let usuarioGuarda = await usuarioDB.save();

            res.json({
                ok: true,
                usuario: usuarioGuarda,
                img: nombreArchivo
            })
        } catch (err) {

            borrarArchivo(usuarioDB.img, 'usuarios');

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Ocurrio un error en el servidor'
                }
            })
        }


    })
}

const imagenProducto = (id, res, nombreArchivo) => {

    Producto.findById(id, async(err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            })
        };

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            })
        }

        try {

            borrarArchivo(productoDB.img, 'productos');

            productoDB.img = nombreArchivo;
            let productoGuarda = await productoDB.save();

            res.json({
                ok: true,
                producto: productoGuarda,
                img: nombreArchivo
            })

        } catch (err) {

            borrarArchivo(productoDB.img, 'productos');

            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Ocurrio un error en el servidor'
                }
            })

        }
    })
}

const borrarArchivo = (nombreImagen, tipo) => {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}

module.exports = app;