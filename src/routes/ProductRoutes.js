const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');

// Rota para buscar produtos
router.get('/product/search', ProductController.search);

// Rota para buscar um produto específico
router.get('/product/:id', ProductController.searchById);

// Rota para cadastrar um novo produto no catálogo com controle do middleware
router.post('/product', authMiddleware, ProductController.create);

// Rota para atualizar um produto com controle do middleware
router.put('/product/:id', authMiddleware, ProductController.update);

// Rota para deletar um produto com controle do middleware
router.delete('/product/:id', authMiddleware, ProductController.delete);

module.exports = router;