const express = require("express");

const Producto = require('../models/producto')
const _ = require('underscore');
const { verificaToken, verificaAdminRol } = require('../middlewares/autenticacion')

const app = express();

app.get('/producto', verificaToken, function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    desde = Number(desde);
    limite = Number(limite);

    Producto.find({ disponible: true })
        .sort('nombre')
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Producto.count({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    producto: productoBD,
                    cuantos: conteo
                });
            });

        })

})

app.get('/producto/:id', verificaToken, function(req, res) {
    const id = req.params.id
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            if (!productoBD) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'Producto no encontrado'
                    }
                })
            }

            res.json({
                ok: true,
                producto: productoBD,
            });

        })

})


app.post('/producto', verificaToken, function(req, res) {
    let body = req.body;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.status(201).json({
            ok: true,
            producto: productoBD
        });
    });

})

app.put('/producto/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre',
        'precioUni',
        'descripcion',
        'disponible',
        'categoria'
    ]);

    Producto.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
        context: 'query'
    }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            producto: productoBD
        });
    })

})

app.delete('/producto/:id', [verificaToken, verificaAdminRol], function(req, res) {
    let id = req.params.id;
    let cambiaEstado = { disponible: false };

    Producto.findByIdAndUpdate(id, cambiaEstado, { new: true }, (err, productoBD) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!productoBD) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            })
        }

        res.json({
            ok: true,
            usuario: productoBD
        });
    })

})

module.exports = app;