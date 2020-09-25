const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/auth');

const Producto = require('../models/productoModel');

const app = express();

// ===============================
// Obtener productos
// ===============================
app.get('/productos', verificaToken, async(req, res) => {

    try {
        let { desde, hasta } = req.query;
        desde = Number(desde) || 0;
        hasta = Number(hasta) || 5;

        let productos = await Producto.find({ disponible: true })
            .sort('nombre').skip(desde)
            .limit(hasta)
            .populate('usuario', 'nombre email')
            .populate('categoria', 'descripcion');

        if (!productos) {
            return res.status(400).json({
                ok: false,
                conteo: 0,
                err: {
                    message: 'No se encontraron registros'
                }
            })
        }

        let conteo = await Producto.countDocuments();
        res.json({
            ok: true,
            conteo,
            productos
        })

    } catch (err) {
        res.status(500).json({
            ok: false,
            err,
            message: "Error en el servidor"
        })
    }
})

// ===============================
// Obtener un producto por ID
// ===============================
app.get('/productos/:id', async(req, res) => {

    try {

        let { id } = req.params;
        let producto = await Producto.findById(id).sort('nombre').populate('usuario', 'nombre email').populate('categoria', 'descripcion');
        res.json({
            ok: true,
            producto
        })

    } catch (err) {
        if (err.kind === "ObjectId") {
            res.status(400).json({
                ok: false,
                err: {
                    message: `el producto con id  ${err.value} no se encuentra`

                }
            });
        } else {
            res.status(500).json({
                ok: false,
                err,
                message: "Error en el servidor"
            })
        }

    }


})

// ===============================
// Crear un nuevo producto
// ===============================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {

    let { termino } = req.params;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productos) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                productos
            })
        })
})


// ===============================
// Crear un nuevo producto
// ===============================
app.post('/productos', verificaToken, async(req, res) => {

    try {

        let { _id } = req.usuario;

        let { nombre, precioUni, descripcion, disponible, categoria } = req.body;

        let producto = new Producto({
            nombre,
            precioUni,
            descripcion,
            disponible,
            categoria,
            usuario: _id
        })

        let productoDB = await producto.save();
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no pudo ser guardado'
                }
            })
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        })


    } catch (err) {

        res.status(500).json({
            ok: false,
            err,
            message: "Error en el servidor"
        })
    }


})

// ===============================
// Actualizar un nuevo producto
// ===============================
app.put('/productos/:id', verificaToken, async(req, res) => {


    try {
        let { _id } = req.usuario;
        let { id } = req.params;
        let { nombre, precioUni, descripcion, disponible, categoria } = req.body;

        let producto = {
            nombre,
            precioUni,
            descripcion,
            disponible: disponible || true,
            categoria,
            usuario: _id
        }

        let productoBD = await Producto.findByIdAndUpdate(id, producto, { new: true, runValidators: true });

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no se encuentra'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        })

    } catch (err) {

        if (err.kind === "ObjectId") {
            res.status(400).json({
                ok: false,
                err: {
                    message: `el producto con id  ${err.value} no se encuentra`

                }
            });
        } else {
            res.status(500).json({
                ok: false,
                err,
                message: "Error en el servidor"
            })
        }
    }


})

// ===============================
// Borrar un producto
// ===============================
app.delete('/productos/:id', verificaToken, async(req, res) => {

    try {

        let { id } = req.params;

        let productoBD = await Producto.findByIdAndUpdate(id, { disponible: false }, { new: true, runValidators: true });

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El producto no se encuentra'
                }
            })
        }

        res.json({
            ok: true,
            message: 'producto marcado como no disponible'
        })

    } catch (err) {

        if (err.kind === "ObjectId") {
            res.status(400).json({
                ok: false,
                err: {
                    message: `el producto con id  ${err.value} no se encuentra`

                }
            });
        } else {
            res.status(500).json({
                ok: false,
                err,
                message: "Error en el servidor"
            })
        }
    }



})

module.exports = app;