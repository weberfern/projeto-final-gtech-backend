const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
    try {
        const authorization = req.headers.authorization;

        // Se não for enviado nenhum token
        if (!authorization) {
            return res.status(400).json({ message: "Acesso bloqueado: não foi fornecido um token." });
        }

        // Cabeçalho no formato Bearer, pega só a numeração
        const token = authorization.split(' ')[1];

        // O JWT verifica se o token é válido usando a chave do .env
        jwt.verify(token, process.env.JWT_SECRET);

        // Se o token for válido, libera o acesso
        next();
    } catch (error) {
        return res.status(400).json({ message: "Acesso bloqueado: Token inválido ou inexistente." });
    }
}

module.exports = authMiddleware;