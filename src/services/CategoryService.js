const { Category } = require('../models');

class CategoryService {
    // Busca por categorias com filtros e paginação
    async searchCategories(query) {
        let { limit = 12, page = 1, use_in_menu, fields } = query;
        limit = parseInt(limit);
        page = parseInt(page);

        let attributesToReturn = ['id', 'name', 'slug', 'use_in_menu'];
        if (fields) {
            attributesToReturn = fields.split(',');
            if (!attributesToReturn.includes('id')) attributesToReturn.push('id');
        }

        const offset = limit !== -1 ? (page - 1) * limit : 0;
        let where = {};
        if (use_in_menu === 'true') where.use_in_menu = true;

        const resultado = await Category.findAndCountAll({
            where,
            attributes: attributesToReturn,
            limit: limit !== -1 ? limit : undefined,
            offset
        });

        return {
            data: resultado.rows,
            total: resultado.count,
            limit,
            page
        };
    }

    // Busca uma categoria pelo ID
    async getCategoryById(id) {
        return await Category.findByPk(id, {
            attributes: ['id', 'name', 'slug', 'use_in_menu']
        });
    }

    // Cria uma nova categoria
    async createCategory(data) {
        const { name, slug, use_in_menu } = data;
        if (!name || !slug) throw new Error("Todos os campos são obrigatórios.");

        const newCategory = await Category.create({ name, slug, use_in_menu });
        const categoryJson = newCategory.toJSON();
        delete categoryJson.createdAt;
        delete categoryJson.updatedAt;
        return categoryJson;
    }

    // Atualiza uma categoria existente
    async updateCategory(id, data) {
        const { name, slug, use_in_menu } = data;
        const category = await Category.findByPk(id);
        if (!category) return null;

        await category.update({ name, slug, use_in_menu });
        return true;
    }

    // Deleta uma categoria
    async deleteCategory(id) {
        const category = await Category.findByPk(id);
        if (!category) return false;

        await category.destroy();
        return true;
    }
}

module.exports = new CategoryService();
