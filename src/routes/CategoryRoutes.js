const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryControllers');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/category/search', CategoryController.search);
router.get('/category/:id', CategoryController.searchById);

// Rota para cadastrar uma nova categoria com controle do middleware
router.post('/category', authMiddleware, CategoryController.create);

// Rota para atualizar uma categoria com controle do middleware
router.put('/category/:id', authMiddleware, CategoryController.update);

// Rota para deletar uma categoria com controle do middleware
router.delete('/category/:id', authMiddleware, CategoryController.delete);

module.exports = router;