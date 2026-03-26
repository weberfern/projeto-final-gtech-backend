const UserService = require('../services/UserService');

const UserController = {
    // Criar novo usuário
    async create(req, res) {
        try {
            const newUser = await UserService.createUser(req.body);
            return res.status(201).json(newUser);
        } catch (error) {
            return res.status(400).json({ message: "Algo deu errado!", error: error.message });
        }
    },

    // Buscar usuário pelo ID
    async searchById(req, res) {
        try {
            const user = await UserService.getUserById(req.params.id);
            if (!user) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.status(200).json(user);
        } catch (error) {
            return res.status(400).json({ message: "Algo deu errado!", error: error.message });
        }
    },

    // Atualizar usuário
    async update(req, res) {
        try {
            const success = await UserService.updateUser(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ message: "Usuário não encontrado." });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao atualizar usuário.", error: error.message });
        }
    },

    // Deletar usuário
    async delete(req, res) {
        try {
            const success = await UserService.deleteUser(req.params.id);
            if (!success) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao deletar usuário.", error: error.message });
        }
    }
};

module.exports = UserController;