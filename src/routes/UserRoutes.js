const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @swagger
 * /v1/user:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Cria um novo usuário.
 *     description: Endpoint para registrar um novo usuário no sistema.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstname
 *               - surname
 *               - email
 *               - password
 *               - confirmPassword
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "Exemplo"
 *               surname:
 *                 type: string
 *                 example: "Sobrenome"
 *               email:
 *                 type: string
 *                 example: "exemplo@email.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *               confirmPassword:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       201:
 *         description: 'Usuário criado com sucesso.'
 *       400:
 *         description: 'Dados inválidos ou erro de validação.'
 */
router.post('/user', UserController.create);

/**
 * @swagger
 * /v1/user/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Usuários
 *     summary: Busca um usuário pelo seu ID.
 *     description: Retorna os dados públicos de um usuário específico.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do usuário a ser buscado.
 *     responses:
 *       200:
 *         description: 'Dados do usuário retornados com sucesso.'
 *       404:
 *         description: 'Usuário não encontrado.'
 */
router.get('/user/:id', authMiddleware, UserController.searchById);

/**
 * @swagger
 * /v1/user/token:
 *   post:
 *     tags:
 *       - Usuários
 *     summary: Autentica um usuário e retorna um token JWT.
 *     description: Realiza o login do usuário com email e senha.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "usuario@email.com"
 *               password:
 *                 type: string
 *                 example: "senha123"
 *     responses:
 *       200:
 *         description: 'Login bem-sucedido.'
 *       400:
 *         description: 'Credenciais inválidas.'
 */
router.post('/user/token', AuthController.login);

/**
 * @swagger
 * /v1/user/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Usuários
 *     summary: Atualiza os dados de um usuário.
 *     description: 'Atualiza informações do usuário. Requer autenticação.'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do usuário a ser atualizado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 example: "Weber"
 *               surname:
 *                 type: string
 *                 example: "Fernandes Souza"
 *               email:
 *                 type: string
 *                 example: "weber_novo@exemplo.com"
 *     responses:
 *       204:
 *         description: 'Usuário atualizado com sucesso.'
 *       400:
 *         description: 'Não autorizado.'
 *       404:
 *         description: 'Usuário não encontrado.'
 */
router.put('/user/:id', authMiddleware, UserController.update);

/**
 * @swagger
 * /v1/user/{id}:
 *   delete:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - Usuários
 *     summary: Deleta um usuário.
 *     description: 'Remove um usuário do sistema. Requer autenticação.'
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: O ID do usuário a ser deletado.
 *     responses:
 *       204:
 *         description: 'Usuário deletado com sucesso.'
 *       400:
 *         description: 'Não autorizado.'
 *       404:
 *         description: 'Usuário não encontrado.'
 */
router.delete('/user/:id', authMiddleware, UserController.delete);


module.exports = router;