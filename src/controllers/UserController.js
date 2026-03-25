const e = require('express');
const { User } = require('../models'); // Importa a tabela de usuários
const bcrypt = require('bcrypt');

const UserController = {
    // Função para criar um novo usuário (POST)
    async create(req, res) {
        try {
            // Recebe os dados do corpo da requisição
            const { firstname, surname, email, password, confirmPassword } = req.body;

            // Verifica se já existe um usuário com esse e-mail
            const userExists = await User.findOne({ where: { email } });
            if (userExists) {
                return res.status(400).json({ message: "Este e-mail já está em uso." });
            }

            // Checando se a senha bate (confirmPassword)
            if (password !== confirmPassword) {
                return res.status(400).json({ message: "As senhas não coincidem." });
            }

            // Criptografando a senha com bcrypt
            const passwordHash = await bcrypt.hash(password, 10);

            // Cria o novo usuário no banco de dados com Sequelize (INSERT INTO)
            const newUser = await User.create({
                firstname,
                surname,
                email,
                password: passwordHash
            });
            // Retorna o usuário criado com status 201 (Created), porém deleta o campo de senha
            const userJson = newUser.toJSON();
            delete userJson.password; // Deleta o campo password, msm que criptografado nao deve ser retornado
            return res.status(201).json(userJson);
        } catch (error) {
            // Se houver erro, retorna status 400 (Bad Request)
            return res.status(400).json({ message: "Algo deu errado!", error: error.message });
        }
    },

    // Função paa buscar um usuário pelo ID (GET)
    async searchById(req, res) {
        try {
            // Pega o ID na barra de endereço (v1/user/5)
            const { id } = req.params;

            // Busca o usuário no banco de dados com Sequelize (SELECT * FROM users WHERE id = ?)
            const user = await User.findByPk(id, {
                attributes: ['id', 'firstname', 'surname', 'email']
            });

            // Se o sequelize não retornar nada
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }

            // Se o sequelize achar, retorna o JSON do usuário
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ message: "Algo deu errado!", error: error.message });
        }
    },

    // Função para atualizar um usuário pelo ID (PUT)
    async update(req, res) {
        try {
            const { id } = req.params;
            const { firstname, surname, email } = req.body;

            const user = await User.findByPk(id);

            // Se o sequelize não retornar nada
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }

            // Atualiza o usuário com Sequelize (UPDATE users SET ...)
            await user.update({
                firstname,
                surname,
                email
            });

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao atualizar usuário.", error: error.message });
        }
    },

    // Função para deletar um usuário pelo ID (DELETE)
    async delete(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findByPk(id);

            // Se o sequelize não retornar nada
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" })
            }

            // Deleta o usuário com Sequelize (DELETE FROM users WHERE id = ?)
            await user.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao deletar usuário.", error: error.message });
        }
    }
};

module.exports = UserController;