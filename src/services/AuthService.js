const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    // Realiza o login e gera um token JWT
    async login(email, password) {
        const user = await User.findOne({ where: { email } });

        if (!user) throw new Error("Credenciais inválidas");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Credenciais inválidas");

        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return token;
    }
}

module.exports = new AuthService();
