const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const AuthController = require('../controllers/AuthController');

// Rotas de usuário
router.post('/user', UserController.create);

// Rota para buscar um usuário pelo ID
router.get('/user/:id', UserController.searchById);

// Rota para atualizar usuário
router.put('/user/:id', UserController.update);

// Rota para deletar usuário
router.delete('/user/:id', UserController.delete);

// Rota de login com token
router.post('/user/token', AuthController.login);

module.exports = router;