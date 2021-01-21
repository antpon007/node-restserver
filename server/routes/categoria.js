const express = require("express");

const Categoria = require('../models/categoria')
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')

const app = express();

app.get('/categoria', verificaToken, function(req, res) {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriaBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categoria: categoriaBD
            });

        })

})

app.get('/categoria/:id', verificaToken, function(req, res) {
    const id = req.params.id
    Categoria.findById(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD,
        });

    })

})

app.post('/categoria', verificaToken, function(req, res) {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaBD
        });
    });

})

app.put('/categoria/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let id = req.params.id;
    let body = req.body;

    let desCategoria = {
        descripcion: body.descripcion
    }

    Categoria.findByIdAndUpdate(id, desCategoria, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            categoria: categoriaBD
        });
    })

})

app.delete('/categoria/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let id = req.params.id;

    Categoria.findByIdAndDelete(id, (err, categoriaBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!categoriaBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            message: 'Categoria borrada'
        });
    })

})



module.exports = app;