const { User } = require('../models');
const bcrypt = require('bcrypt');

class UserService {
    // Cria um novo usuário com hashing de senha
    async createUser(data) {
        const { firstname, surname, email, password, confirmPassword } = data;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) throw new Error("Este e-mail já está em uso.");

        if (password !== confirmPassword) throw new Error("As senhas não coincidem.");

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstname,
            surname,
            email,
            password: passwordHash
        });

        const userJson = newUser.toJSON();
        delete userJson.password;
        return userJson;
    }

    // Busca um usuário pelo ID
    async getUserById(id) {
        return await User.findByPk(id, {
            attributes: ['id', 'firstname', 'surname', 'email']
        });
    }

    // Atualiza um usuário existente
    async updateUser(id, data) {
        const { firstname, surname, email } = data;
        const user = await User.findByPk(id);
        if (!user) return null;

        await user.update({ firstname, surname, email });
        return true;
    }

    // Deleta um usuário
    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) return false;

        await user.destroy();
        return true;
    }
}

module.exports = new UserService();
