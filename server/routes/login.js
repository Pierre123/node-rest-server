const express = require('express'); //peticiones y otras cosas

const bcrypt = require('bcrypt'); //encriptar password

const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario'); // modelo de mongoose y validaciones
const app = express();



app.post('/login', (req, res) => {

    let body = req.body;
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: '(Usuario) o contrasena incorrecto'
                }
            });
        }
        // comparar el password enviado en el body
        // con el password encriptado en la bdd


        if (bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario o (contrasena) incorrecto'
                }
            });
        }

        let token = jwt.sign({
            usuario: usuarioDB
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        res.json({
            ok: true,
            usuario: usuarioDB,
            token
        })


    });


});




module.exports = app;