const jwt = require('jsonwebtoken');


///=================
///Verificar token
///==============
/// next continua ejecucion del programa

let verificaToken = (req, res, next) => {
    // leer headers  y validar el token 

    let token = req.get('Authorization'); // variable definida en el header: token
    //console.log(token);
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token invalido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next(); // para q continue con lo siguiente que debe ejecutar
    });


};


///=================
///Verificar admin role
///==============
/// 

let verificaAdminRole = (req, res, next) => {
    //verificar role obteniendo datos
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
    } else {

        return res.json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
};

module.exports = {
    verificaToken,
    verificaAdminRole
}