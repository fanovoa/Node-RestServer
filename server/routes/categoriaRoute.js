const express = require('express');

const { verificaToken, verificaAdmin_Role } = require('../middlewares/auth');

const Categoria = require('../models/categoriaModel');

const app = express();

// ===============================
// Mostrar todas las categorias
// ===============================
app.get('/categoria', verificaToken, async(req, res) => {

    try {
        let categorias = await Categoria.find().sort('descripcion').populate('usuario', 'nombre email');
        let conteo = await Categoria.countDocuments();

        if (!categorias) {
            return res.status(400).json({
                ok: false,
                conteo: 0,
                err: {
                    message: 'no se encontraron categorias'
                }
            })
        }

        res.json({
            ok: true,
            categorias,
            conteo
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            err,
            message: "Error en el servidor"
        })
    }

});

// ===============================
// Mostrar una categoria por ID
// ===============================
app.get('/categoria/:id', verificaToken, async(req, res) => {

    try {
        let { id } = req.params;
        let categoria = await Categoria.findById(id);

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'categoria no encontrada'
                }
            })
        };

        res.json({
            ok: true,
            categoria
        });

    } catch (err) {
        res.status(500).json({
            ok: false,
            err,
            message: "Error en el servidor"
        })
    }

});

// ===============================
// Crear nueva categoria
// ===============================
app.post('/categoria', verificaToken, async(req, res) => {

    try {
        let body = req.body;
        let usuario = req.usuario._id;
        let categoria = new Categoria({
            descripcion: body.descripcion,
            usuario
        })

        let categoriaDB = await categoria.save();

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    menssage: 'no fue posible crear la categoria'
                }
            })
        }

        res.status(201).json({
            ok: true,
            categoria: categoriaDB
        })

    } catch (err) {
        res.status(500).json({
            ok: false,
            err,
            message: "Error en el servidor"
        })
    }

});

// ===============================
// Actualizar la categoria
// ===============================
app.put('/categoria/:id', verificaToken, async(req, res) => {

    try {

        let { id } = req.params;
        let { descripcion } = req.body;
        let buscarCategoria = await Categoria.findById(id);
        if (!buscarCategoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encontro una categoria con ese id'
                }
            })
        }

        let categoria = await Categoria.findByIdAndUpdate(id, { descripcion }, { new: true, runValidators: true });

        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    menssage: 'No fue posible actualizar la categoria'
                }
            })
        }

        res.json({
            ok: true,
            categoria
        })

    } catch (err) {
        res.status(500).json({
            ok: false,
            err,
            message: "Error en el servidor"
        })
    }
});

// ===============================
// Borrar la categoria
// ===============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], async(req, res) => {

    try {

        let { id } = req.params;

        let categoria = await Categoria.findById(id);
        if (!categoria) {
            return res.status(400).json({
                ok: false,
                err: {
                    menssage: 'No se encontro una categoria con ese id'
                }
            })
        }
        let eliminaCategoria = await Categoria.findByIdAndRemove(id);
        res.json({
            ok: true,
            categoria: eliminaCategoria,
            message: 'categoria eliminada'
        });

    } catch (err) {

        res.status(500).json({
            ok: false,
            err,
            message: "Error en el servidor"
        })
    }
});


module.exports = app;