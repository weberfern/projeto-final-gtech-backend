const { Product, ProductImage, ProductOption, ProductCategory, Category } = require('../models');
const { Op } = require('sequelize');

const ProductController = {
    // Função para salvar um produto com fotos e categorias
    async create(req, res) {
        try {
            const {
                enabled, name, slug, use_in_menu, stock,
                description, price, price_with_discount,
                category_ids, images, options
            } = req.body;

            // Salvar na tabela product
            const novoProduto = await Product.create({
                enabled, name, slug, use_in_menu, stock, description, price, price_with_discount
            });

            // Relacionar as categorias
            if (category_ids && category_ids.length > 0) {
                // Para cada ID de categoria salva uma linha na tabela auxiliar ProductCategory
                for (let category_id of category_ids) {
                    await ProductCategory.create({
                        product_id: novoProduto.id, // O ID do produto
                        category_id: category_id
                    });
                }
            }

            // Salvar as imagens
            if (images && images.length > 0) {
                for (let image of images) {
                    await ProductImage.create({
                        product_id: novoProduto.id,
                        path: image.content
                    });
                }
            }

            // Salvar as opções (tamanho, cor)
            if (options && options.length > 0) {
                for (let option of options) {
                    await ProductOption.create({
                        product_id: novoProduto.id,
                        title: option.title,
                        shape: option.shape,
                        radius: option.radius,
                        type: option.type,
                        values: option.values.join(',')
                    });
                }
            }

            return res.status(201).json(novoProduto);

        } catch (error) {
            return res.status(400).json({ message: "Erro ao criar produto", error: error.message });
        }
    },

    // Busca de produtos
    async search(req, res) {
        try {
            // Limita a quantidade de produtos por página
            let {
                limit = 12, page = 1, match,
                category_ids, 'price_range': priceRange, fields
            } = req.query;
            limit = parseInt(limit);
            page = parseInt(page);

            // Lógica offset, se está na page 3 buscando 10 itens, os 20 itens das pages 1 e 2 devem ficar pra trás
            let salto = limit !== -1 ? (page - 1) * limit : 0;
            let searchRules = {}; // WHERE da tabaela produtos
            let includeRules = []; // JOINs

            // Filtro lupa (match)
            if (match) {
                searchRules[Op.or] = [
                    { name: { [Op.like]: `%${match}%` } },
                    { description: { [Op.like]: `%${match}%` } }
                ];
            }

            // Filtro de price Range (?price-range=100-200)
            if (priceRange) {
                const [min, max] = priceRange.split('-'); // Corta a string no tracinho
                searchRules.price = {
                    [Op.between]: [parseFloat(min), parseFloat(max)] // Comando BETWEEN do SQL
                };
            }

            // Filtro de categoria (?category_ids=1,15)
            if (category_ids) {
                // Transforma '1,15' em um array [1, 15] de números Int
                const idsArray = category_ids.split(',').map(id => parseInt(id));

                includeRules.push({
                    model: Category,
                    as: 'categories',
                    where: { id: { [Op.in]: idsArray } }, // Pega apenas se estiver In (dentro) do Array
                    through: { attributes: [] }
                })
            }

            // Filtro de Opções do Produto (?option[45]=GG,PP)
            if (req.query.option) {
                // O loop for...of extrai o ID "45" e a string "GG,PP" 
                for (const [optionId, optionValues] of Object.entries(req.query.option)) {

                    const valuesArray = optionValues.split(','); // Transforma "GG,PP" em ['GG', 'PP']
                    includeRules.push({
                        model: ProductOption,
                        as: 'options',
                        where: {
                            id: parseInt(optionId),
                            // Cria regras LIKE na tabela Vizinhas buscando a palavra 'GG' ou 'PP' na string
                            [Op.or]: valuesArray.map(val => ({
                                values: { [Op.like]: `%${val}%` }
                            }))
                        }
                    });
                }
            }

            // Filtro de campos (?fields=name,price)
            let attributesToReturn = undefined;
            if (fields) {
                attributesToReturn = fields.split(',')
                if (!attributesToReturn.includes('id')) {
                    attributesToReturn.push('id');
                }
            }

            // Busca no banco
            const resultado = await Product.findAndCountAll({
                where: searchRules,
                attributes: attributesToReturn,
                include: includeRules,
                limit: limit !== -1 ? limit : undefined,
                offset: salto,
                distinct: true // Pega produtos distintos se tiver em categorias diferentes
            });

            return res.status(200).json({
                data: resultado.rows,
                total: resultado.count,
                limit: limit,
                page: page
            });

        } catch (error) {
            return res.status(400).json({ message: "Erro na busca", error: error.message });
        }
    },

    // Buscar um produto específico
    async searchById(req, res) {
        try {
            const { id } = req.params;
            const produto = await Product.findByPk(id);
            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }

            return res.status(200).json(produto);
        } catch (error) {
            return res.status(400).json({ message: "Erro na busca", error: error.message });
        }
    },

    // Deletar produto
    async delete(req, res) {
        try {
            const { id } = req.params;
            const produto = await Product.findByPk(id);
            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }

            await produto.destroy();
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao deletar produto", error: error.message });
        }
    },

    // Atualizar produto
    async update(req, res) {
        try {
            const { id } = req.params;
            // O Javascript "Puxa e Separa" (desestrutura) só os Arrays de Imagens e Variações. Tudo que sobrar (nome, preço, stock) vai para a variável `dadosRestantes`!
            const { images, options, category_ids, ...dadosRestantes } = req.body;

            const produto = await Product.findByPk(id);

            if (!produto) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }

            // Atualiza a tabela-mãe
            await produto.update(dadosRestantes);

            // Se o Front enviou categorias novas, a função setCategories inejta e apaga a velha
            if (category_ids) {
                await produto.setCategories(category_ids);
            }

            // Lógica Destrutiva de Fotos
            if (images && images.length > 0) {
                for (let img of images) {
                    if (img.deleted) {
                        // O FrontEnd manda deletar a foto do produto
                        await ProductImage.destroy({ where: { id: img.id, product_id: id } });
                    } else if (img.id) {
                        // Delete a foto antiga e insere a nova
                        await ProductImage.update({ path: img.content }, { where: { id: img.id, product_id: id } });
                    } else if (img.content) {
                        // Insere a nova foto
                        await ProductImage.create({ path: img.content, product_id: id, enabled: img.enabled || 0 });
                    }
                }
            }

            // Lógica Destrutiva de Variações de Cor/Tamanho
            if (options && options.length > 0) {
                for (let opt of options) {
                    // O React sempre manda as Variações em Array ["PP", "M"], mas o SQL pede Texto "PP,M"
                    if (opt.values && Array.isArray(opt.values)) {
                        opt.values = opt.values.join(',');
                    }

                    if (opt.deleted) {
                        await ProductOption.destroy({ where: { id: opt.id, product_id: id } });
                    } else if (opt.id) {
                        await ProductOption.update(opt, { where: { id: opt.id, product_id: id } });
                    } else {
                        await ProductOption.create({ ...opt, product_id: id });
                    }
                }
            }

            return res.status(204).send();

        } catch (error) {
            return res.status(400).json({ message: "Erro crítico ao atualizar", error: error.message });
        }
    }
}

module.exports = ProductController;