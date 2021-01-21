const jwt = require("jsonwebtoken");

//===================
// Verificar Token
//===================
let verificaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: 'Token no válido'
            })
        }
        req.usuario = decoded.usuario
        next();
    });
}

let verificaAdminRol = (req, res, next) => {
    let usuario = req.usuario;
    if (usuario.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            ok: false,
            err: 'No tiene permiso para esta opción'
        })
    }
    next();
}

module.exports = {
    verificaToken,
    verificaAdminRol
}