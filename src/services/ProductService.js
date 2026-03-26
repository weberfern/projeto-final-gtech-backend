const { Product, ProductImage, ProductOption, ProductCategory, Category, sequelize } = require('../models');
const { Op } = require('sequelize');

class ProductService {
    // Busca de produtos com filtros complexos
    async searchProducts(query) {
        let {
            limit = 12, page = 1, match,
            category_ids, price_range, fields
        } = query;
        limit = parseInt(limit);
        page = parseInt(page);
        
        const offset = limit !== -1 ? (page - 1) * limit : 0;
        let searchRules = {};
        
        if (match) {
            searchRules[Op.or] = [
                { name: { [Op.like]: `%${match}%` } },
                { description: { [Op.like]: `%${match}%` } }
            ];
        }

        if (price_range) {
            const [min, max] = price_range.split('-');
            searchRules.price = {
                [Op.between]: [parseFloat(min), parseFloat(max)]
            };
        }

        let includeCategory = { model: Category, as: 'categories', through: { attributes: [] } };
        let includeOption = { model: ProductOption, as: 'options' };
        let includeImage = { model: ProductImage, as: 'images' };

        if (category_ids) {
            const idsArray = category_ids.split(',').map(id => parseInt(id));
            includeCategory.where = { id: { [Op.in]: idsArray } };
        }

        if (query.option) {
            let orConditions = [];
            for (const [optionId, optionValues] of Object.entries(query.option)) {
                const valuesArray = optionValues.split(',');
                orConditions.push({
                    id: parseInt(optionId),
                    [Op.or]: valuesArray.map(val => ({
                        values: { [Op.like]: `%${val}%` }
                    }))
                });
            }
            includeOption.where = { [Op.or]: orConditions };
        }

        let attributesToReturn = undefined;
        if (fields) {
            attributesToReturn = fields.split(',');
            if (!attributesToReturn.includes('id')) attributesToReturn.push('id');
        }

        const resultado = await Product.findAndCountAll({
            where: searchRules,
            attributes: attributesToReturn,
            include: [includeCategory, includeOption, includeImage],
            limit: limit !== -1 ? limit : undefined,
            offset: offset,
            distinct: true
        });

        // Formatação dos dados
        const items = resultado.rows.map(produto => this._formatProduct(produto));

        return {
            data: items,
            total: resultado.count,
            limit: limit,
            page: page
        };
    }

    // Busca um produto específico por ID
    async getProductById(id) {
        const produto = await Product.findByPk(id, {
            include: [
                { model: Category, as: 'categories', through: { attributes: [] } },
                { model: ProductImage, as: 'images' },
                { model: ProductOption, as: 'options' }
            ]
        });

        if (!produto) return null;
        return this._formatProduct(produto);
    }

    // Cria um novo produto com todas as associações
    async createProduct(data) {
        const {
            category_ids, images, options, ...productData
        } = data;

        const t = await sequelize.transaction();

        try {
            const productExists = await Product.findOne({ where: { name: productData.name }, transaction: t });
            if (productExists) throw new Error("Um produto com este nome já existe.");

            const novoProduto = await Product.create(productData, { transaction: t });

            // Relacionar Categorias
            if (category_ids?.length > 0) {
                await Promise.all(category_ids.map(category_id => 
                    ProductCategory.create({ product_id: novoProduto.id, category_id }, { transaction: t })
                ));
            }

            // Salvar Imagens
            if (images?.length > 0) {
                await Promise.all(images.map(image => 
                    ProductImage.create({ product_id: novoProduto.id, path: image.content }, { transaction: t })
                ));
            }

            // Salvar Opções
            if (options?.length > 0) {
                await Promise.all(options.map(option => 
                    ProductOption.create({
                        product_id: novoProduto.id,
                        title: option.title,
                        shape: option.shape,
                        radius: option.radius,
                        type: option.type,
                        values: (option.values || option.value).join(',')
                    }, { transaction: t })
                ));
            }

            await t.commit();
            return novoProduto;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // Atualiza um produto existente
    async updateProduct(id, data) {
        const { images, options, category_ids, ...dadosRestantes } = data;
        const t = await sequelize.transaction();

        try {
            const produto = await Product.findByPk(id, { transaction: t });
            if (!produto) return null;

            await produto.update(dadosRestantes, { transaction: t });

            if (category_ids) {
                await produto.setCategories(category_ids, { transaction: t });
            }

            // Lógica de Imagens
            if (images?.length > 0) {
                for (let img of images) {
                    if (img.deleted) {
                        await ProductImage.destroy({ where: { id: img.id, product_id: id }, transaction: t });
                    } else if (img.id) {
                        await ProductImage.update({ path: img.content }, { where: { id: img.id, product_id: id }, transaction: t });
                    } else if (img.content) {
                        await ProductImage.create({ path: img.content, product_id: id, enabled: img.enabled || false }, { transaction: t });
                    }
                }
            }

            // Lógica de Opções
            if (options?.length > 0) {
                for (let opt of options) {
                    const valSource = opt.values || opt.value;
                    if (valSource && Array.isArray(valSource)) opt.values = valSource.join(',');

                    if (opt.deleted) {
                        await ProductOption.destroy({ where: { id: opt.id, product_id: id }, transaction: t });
                    } else if (opt.id) {
                        await ProductOption.update(opt, { where: { id: opt.id, product_id: id }, transaction: t });
                    } else {
                        await ProductOption.create({ ...opt, product_id: id }, { transaction: t });
                    }
                }
            }

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // Deleta um produto e suas associações
    async deleteProduct(id) {
        const t = await sequelize.transaction();
        try {
            const produto = await Product.findByPk(id, { transaction: t });
            if (!produto) return false;

            await ProductImage.destroy({ where: { product_id: id }, transaction: t });
            await ProductOption.destroy({ where: { product_id: id }, transaction: t });
            await ProductCategory.destroy({ where: { product_id: id }, transaction: t });
            await produto.destroy({ transaction: t });

            await t.commit();
            return true;
        } catch (error) {
            await t.rollback();
            throw error;
        }
    }

    // Função privada para formatar o objeto de produto
    _formatProduct(produto) {
        let obj = produto.toJSON ? produto.toJSON() : produto;
        delete obj.createdAt;
        delete obj.updatedAt;
        delete obj.use_in_menu;

        if (obj.categories) {
            obj.category_ids = obj.categories.map(c => c.id);
            delete obj.categories;
        }
        if (obj.images) {
            obj.images = obj.images.map(img => ({ id: img.id, content: img.path }));
        }
        if (obj.options) {
            obj.options = obj.options.map(opt => {
                delete opt.createdAt;
                delete opt.updatedAt;
                return opt;
            });
        }
        return obj;
    }
}

module.exports = new ProductService();
