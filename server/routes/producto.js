const express = require('express');
let { verificaToken } = require('../middlewares/autenticacion');
let app = express();

let Producto = require('../models/producto');

//======================
//Buscar Productos 
//======================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'nombre')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                productos: productoDB

            });
        })
});

//======================
//Obtener Productos    
//======================
app.get('/productos', verificaToken, (req, res) => {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Producto.find({ disponible: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .skip(desde)
        .limit(limite)
        .exec((err, productosDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            res.json({
                ok: true,
                productosDB
            });
        });
});


//======================
//Obtener Producto x id   
//======================

app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            };
            if (!productoDB) {
                return res.status(400).json({
                    ok: true,
                    err: {
                        message: 'El producto no existe'
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});


//======================
//Crear Productos    
//======================

app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });

});

//======================
//Actualizar Productos x id  
//======================

app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let productoActualizado = {
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: true

    };

    Producto.findByIdAndUpdate(id, productoActualizado, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB
        });

    });

});

//======================
//Eliminar Productos  x id  
//======================

app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let productoDesabilitado = {
        disponible: false
    }
    Producto.findByIdAndUpdate(id, productoDesabilitado, { new: true, runValidators: true, context: 'query' }, (err, productoDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no encontrado'
                }
            });
        }
        res.json({
            ok: true,
            producto: productoDB,
            message: 'El producto se ha Deshabilitado'
        });
    });
});




module.exports = app;