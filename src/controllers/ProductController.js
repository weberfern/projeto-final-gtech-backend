const ProductService = require('../services/ProductService');

const ProductController = {
    // Busca de produtos com filtros
    async search(req, res) {
        try {
            const resultado = await ProductService.searchProducts(req.query);
            return res.status(200).json(resultado);
        } catch (error) {
            return res.status(400).json({ message: "Erro na busca", error: error.message });
        }
    },

    // Buscar um produto específico
    async searchById(req, res) {
        try {
            const product = await ProductService.getProductById(req.params.id);
            if (!product) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }
            return res.status(200).json(product);
        } catch (error) {
            return res.status(400).json({ message: "Erro na busca", error: error.message });
        }
    },

    // Função para salvar um produto com fotos e categorias
    async create(req, res) {
        try {
            const novoProduto = await ProductService.createProduct(req.body);
            return res.status(201).json(novoProduto);
        } catch (error) {
            return res.status(400).json({ 
                message: error.message === "Um produto com este nome já existe." 
                    ? error.message 
                    : "Erro ao criar produto", 
                error: error.message 
            });
        }
    },

    // Deletar produto
    async delete(req, res) {
        try {
            const success = await ProductService.deleteProduct(req.params.id);
            if (!success) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro ao deletar produto", error: error.message });
        }
    },

    // Atualizar produto
    async update(req, res) {
        try {
            const success = await ProductService.updateProduct(req.params.id, req.body);
            if (!success) {
                return res.status(404).json({ message: "Produto não encontrado" });
            }
            return res.status(204).send();
        } catch (error) {
            return res.status(400).json({ message: "Erro crítico ao atualizar", error: error.message });
        }
    }
}

module.exports = ProductController;