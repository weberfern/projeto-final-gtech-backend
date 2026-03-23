const express = require("express");
const app = express();

// Configuração do servidor
app.use(express.json());

// Importação de rotas
const userRoutes = require('./routes/UserRoutes');
const categoryRoutes = require('./routes/CategoryRoutes');
const productRoutes = require('./routes/ProductRoutes');

// Uso das rotas
app.use('/v1', userRoutes);
app.use('/v1', categoryRoutes);
app.use('/v1', productRoutes);

// Criação da primeira rota
app.get('/v1/status', (requisicao, resposta) => {
    return resposta.json({
        message: "O servidor está funcionando!"
    });
})

module.exports = app;