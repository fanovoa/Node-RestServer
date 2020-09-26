const jwt = require('jsonwebtoken');


// ==========================
// Verificar Token
// ===========================
let verificaToken = (req, res, next) => {

    //enviado por headers
    let token = req.get('Authorization');

    //token - semilla - decoded:payload del token
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    menssage: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

};

// ==========================
// Verificar AdministradorRole
// ===========================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (!(usuario.role === 'ADMIN_ROLE')) {

        return res.status(401).json({
            ok: false,
            usuario,
            err: {
                message: 'El usuario no es Administrador'
            }
        })
    }
    next();
}


// ==========================
// Verificar Token para imagen
// ===========================
let verificaTokenImg = (req, res, next) => {

    let { Authorization } = req.query;

    jwt.verify(Authorization, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    menssage: 'Token no valido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}


module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
}