const { Category } = require('../models');

const CategoryController = {
    // Função de busca com paginação
    async search(req, res) {
        try {
            // Pega as query strings da url, se não mandar nada assume valores padrão
            let { limit = 12, page = 1, use_in_menu, fields } = req.query;
            limit = parseInt(limit);
            page = parseInt(page);

            let attributesToReturn = undefined;
            if (fields) {
                attributesToReturn = fields.split(',');
                if (!attributesToReturn.includes('id')) {
                    attributesToReturn.push('id'); // ID é chave primária, sempre tem que vir junto!
                }
            }

            // Lógica offset, se está na page 3 buscando 10 itens, os 20 itens das pages 1 e 2 devem ficar pra trás
            let salto = 0;
            if (limit !== -1) {
                salto = (page - 1) * limit;
            }

            // Se vier 'user_in_menu=true' vai ser add na busca
            let searchRules = {};
            if (use_in_menu === 'true') {
                searchRules.use_in_menu = true;
            }

            // Sequelize acha as categorias e já contabiliza no total de registros
            const resultado = await Category.findAndCountAll({
                where: searchRules,
                attributes: attributesToReturn,
                limit: limit !== -1 ? undefined : limit,
                offset: salto
            });

            return res.status(200).json({
                data: resultado.rows, // Array com as categorias
                total: resultado.count, // Quantidade existente no banco
                limit: limit,
                page: page
            });
        } catch (error) {
            return res.status(400).json({ message: "Erro na busca", error: error.message });
        }
    },

    // Buscar apenas uma categoria específica
    async searchById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }

            return res.status(200).json(category);
        } catch (error) {
            return res.status(400).json({ message: "Erro na busca", error: error.message });
        }
    },

    // Criar nova categoria
    async create(req, res) {
        try {
            const { name, slug, use_in_menu } = req.body;
            const newCategory = await Category.create({ name, slug, use_in_menu });
            return res.status(201).json(newCategory);
        } catch (error) {
            return res.status(400).json({ message: "Erro ao criar categoria", error: error.message });
        }
    },

    // Atualizar categoria
    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, slug, use_in_menu } = req.body;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }

            await category.update({ name, slug, use_in_menu });

            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao atualizar categoria", error: error.message });
        }
    },

    // Deletar categoria
    async delete(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.findByPk(id);

            if (!category) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }

            await category.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao deletar categoria", error: error.message });
        }
    }
}

module.exports = CategoryController;