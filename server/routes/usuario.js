const express = require('express'); //peticiones y otras cosas

const bcryp = require('bcrypt'); //encriptar password
const _ = require('underscore'); //libreria para objetos

const Usuario = require('../models/usuario'); // modelo de mongoose y validaciones
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const app = express();

app.get('/usuario', verificaToken, (req, res) => {


    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.countDocuments({
                estado: true
            }, (err, contador) => {
                res.json({
                    ok: true,
                    usuarios,
                    contador
                });
            })

        })


});

//POST
app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcryp.hashSync(body.password, 10),
        role: body.role
    });
    //Guardar Datos en MongoDB
    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });
});

//PUT
app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre',
        'email',
        'img',
        'role',
        'estado'
    ]);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

//DELETE
app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let cambiarEstado = {
        estado: false
    }
    Usuario.findByIdAndUpdate(id, cambiarEstado, { new: true, runValidators: true, context: 'query' }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;