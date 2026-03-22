const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const AuthController = {
    // Função para o usuario fazer login e ganhar o token
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Verificando se há usuario com email no banco de dados
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: "Credenciais inválidas" });
            }

            // Se email tiver no banco de dados verifica a senha criptograda com bcrypt (analisa o hash)
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Credenciais inválidas" });
            }

            // Se a senha estiver correta gera o token
            const token = jwt.sign(
                { id: user.id, email: user.email },
                process.env.JWT_SECRET,
                { expiresIn: '3h' }
            );

            // Retorna o token em formato json para o localStorage
            return res.status(200).json({ token });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}

module.exports = AuthController;