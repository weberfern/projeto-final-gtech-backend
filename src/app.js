const express = require("express");
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const app = express();

const port = process.env.PORT || 3000;

// Configuração do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Drip Store Backend',
            version: '1.0.0',
            description: 'Documentação da API Drip Store Backend.',
        },
        servers: [
            {
                url: `http://localhost:${port}`,
                description: 'Servidor Local',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

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

/**
 * @swagger
 * /v1/status:
 *   get:
 *     summary: Verifica o status do servidor
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Servidor funcionando
 */
app.get('/v1/status', (requisicao, resposta) => {
    return resposta.json({
        message: "O servidor está funcionando!"
    });
})

module.exports = app;