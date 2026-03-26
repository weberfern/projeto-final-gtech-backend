const CategoryService = require('../services/CategoryService');

const CategoryController = {
    // Busca com paginação
    async search(req, res) {
        try {
            const resultado = await CategoryService.searchCategories(req.query);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(400).json({ message: "Erro na busca", error: error.message });
        }
    },

    // Buscar por ID
    async searchById(req, res) {
        try {
            const category = await CategoryService.getCategoryById(req.params.id);
            if (!category) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }
            return res.status(200).json(category);
        } catch (error) {
            return res.status(400).json({ message: "Erro na busca", error: error.message });
        }
    },

    // Criar categoria
    async create(req, res) {
        try {
            const newCategory = await CategoryService.createCategory(req.body);
            return res.status(201).json(newCategory);
        } catch (error) {
            return res.status(400).json({ message: "Erro ao criar categoria", error: error.message });
        }
    },

    // Atualizar categoria
    async update(req, res) {
        try {
            const success = await CategoryService.updateCategory(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao atualizar categoria", error: error.message });
        }
    },

    // Deletar categoria
    async delete(req, res) {
        try {
            const success = await CategoryService.deleteCategory(req.params.id);
            if (!success) {
                return res.status(404).json({ message: "Categoria não encontrada" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao deletar categoria", error: error.message });
        }
    }
}

module.exports = CategoryController;