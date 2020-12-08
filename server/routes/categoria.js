const express = require('express');
let { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
let app = express();

let Categoria = require('../models/categoria');



//======================
//Mostrar todas las categorias
//======================
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        //si quiero otro schema creariamos otro populate con la informacion deseada
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            res.json({
                ok: true,
                categoriasDB
            });
        });
});

//======================
//Mostrar una categoria x id
//======================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: true,
                err: {
                    message: 'la categoria no existe'
                }
            });
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

//======================
//Crear nueva categoria
//======================
app.post('/categoria', verificaToken, (req, res) => {
    //regresar nueva categoria
    //
    let body = req.body;
    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });
    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });

});


//======================
//Actualizar categoria
//======================
app.put('/categoria/:id', verificaToken, (req, res) => {
    //regresar nueva categoria
    //
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };
    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });
});



//======================
//Eliminar categoria    
//======================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    //regresar nueva categoria
    //
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Categoria no encontrada'
                }
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        });
    });

});

module.exports = app;