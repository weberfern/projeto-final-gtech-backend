const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/CategoryControllers');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /v1/category/search:
 *   get:
 *     tags:
 *       - Categorias
 *     summary: Busca por categorias.
 *     description: Retorna uma lista de categorias cadastradas no sistema.
 *     responses:
 *       200:
 *         description: 'Lista de categorias encontrada.'
 *       400:
 *         description: 'Falha na busca.'
 */
router.get('/category/search', CategoryController.search);

/**
 * @swagger
 * /v1/category/{id}:
 *   get:
 *     tags:
 *       - Categorias
 *     summary: Busca uma categoria pelo ID.
 *     description: Retorna os detalhes de uma categoria específica.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID da categoria a ser buscada.
 *     responses:
 *       200:
 *         description: 'Categoria encontrada.'
 *       404:
 *         description: 'Categoria não encontrada.'
 */
router.get('/category/:id', CategoryController.searchById);

/**
 * @swagger
 * /v1/category:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorias
 *     summary: Cria uma nova categoria.
 *     description: Cadastra uma nova categoria. Requer autenticação.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - slug
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Calçados"
 *               slug:
 *                 type: string
 *                 example: "calcados"
 *               use_in_menu:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: 'Categoria criada com sucesso.'
 *       400:
 *         description: 'Não autorizado.'
 */
router.post('/category', authMiddleware, CategoryController.create);

/**
 * @swagger
 * /v1/category/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorias
 *     summary: Atualiza uma categoria existente.
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
 *                 example: "Calçados Esportivos"
 *               slug:
 *                 type: string
 *                 example: "calcados-esportivos"
 *               use_in_menu:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       204:
 *         description: 'Categoria atualizada com sucesso.'
 *       400:
 *         description: 'Não autorizado.'
 *       404:
 *         description: 'Categoria não encontrada.'
 */
router.put('/category/:id', authMiddleware, CategoryController.update);

/**
 * @swagger
 * /v1/category/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Categorias
 *     summary: Deleta uma categoria.
 *     description: Requer autenticação.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: 'Categoria deletada com sucesso.'
 *       400:
 *         description: 'Não autorizado.'
 *       404:
 *         description: 'Categoria não encontrada.'
 */
router.delete('/category/:id', authMiddleware, CategoryController.delete);

module.exports = router;