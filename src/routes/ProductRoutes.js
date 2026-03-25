const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /v1/product/search:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Busca por produtos.
 *     description: Retorna uma lista de produtos disponíveis.
 *     responses:
 *       200:
 *         description: 'Produtos encontrados.'
 */
router.get('/product/search', ProductController.search);

/**
 * @swagger
 * /v1/product/{id}:
 *   get:
 *     tags:
 *       - Produtos
 *     summary: Busca um produto pelo ID.
 *     description: Retorna os detalhes de um produto específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 'Produto encontrado.'
 *       404:
 *         description: 'Produto não encontrado.'
 */
router.get('/product/:id', ProductController.searchById);

/**
 * @swagger
 * /v1/product:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Produtos
 *     summary: Cria um novo produto.
 *     description: Requer autenticação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               enabled:
 *                 type: boolean
 *                 example: true
 *               name:
 *                 type: string
 *                 example: "Tênis Runner 2.0"
 *               slug:
 *                 type: string
 *                 example: "tenis-runner-20"
 *               stock:
 *                 type: integer
 *                 example: 50
 *               description:
 *                 type: string
 *                 example: "Um tênis de alta performance."
 *               price:
 *                 type: number
 *                 example: 299.90
 *               price_with_discount:
 *                 type: number
 *                 example: 249.90
 *     responses:
 *       201:
 *         description: 'Produto criado com sucesso.'
 *       400:
 *         description: 'Não autorizado.'
 */
router.post('/product', authMiddleware, ProductController.create);

/**
 * @swagger
 * /v1/product/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Produtos
 *     summary: Atualiza um produto existente.
 *     description: Requer autenticação.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Tênis Runner 2.0 Pro"
 *               price:
 *                 type: number
 *                 example: 349.90
 *     responses:
 *       204:
 *         description: 'Produto atualizado com sucesso.'
 *       400:
 *         description: 'Não autorizado.'
 *       404:
 *         description: 'Produto não encontrado.'
 */
router.put('/product/:id', authMiddleware, ProductController.update);

/**
 * @swagger
 * /v1/product/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Produtos
 *     summary: Deleta um produto.
 *     description: Requer autenticação.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 'Produto deletado com sucesso.'
 *       400:
 *         description: 'Não autorizado.'
 *       404:
 *         description: 'Produto não encontrado.'
 */
router.delete('/product/:id', authMiddleware, ProductController.delete);

module.exports = router;