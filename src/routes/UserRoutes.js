const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');
const authMiddleware = require('../middleware/authMiddleware');

// Rotas de usuário
router.post('/user', UserController.create);

// Rota para buscar um usuário pelo ID
router.get('/user/:id', UserController.searchById);

// Rota de login com token
router.post('/user/token', AuthController.login);

// Rota para atualizar usuário com segurança do middleware
router.put('/user/:id', authMiddleware, UserController.update);

// Rota para deletar usuário com segurança do middleware
router.delete('/user/:id', authMiddleware, UserController.delete);


module.exports = router;