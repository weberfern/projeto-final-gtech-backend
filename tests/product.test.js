const request = require('supertest');
const app = require('../src/app');
const { sequelize, Product } = require('../src/models');

beforeAll(async () => {
    // Sincroniza o banco de teste, recriando as tabelas (Verificar se no .env o DB_TEST_NAME está configurado corretamente)
    await sequelize.sync({ force: true });

    // Cria um usuário admin para poder criar produtos
    await request(app)
        .post('/v1/user')
        .send({
            firstname: 'Test', surname: 'Prod', email: 'admin.prod@example.com',
            password: 'password123', confirmPassword: 'password123',
        });

    // Pega o token do usuário admin
    const tokenRes = await request(app)
        .post('/v1/user/token')
        .send({
            email: 'admin.prod@example.com', password: 'password123',
        });
    token = tokenRes.body.token;

    // Cria uma categoria para poder associar ao produto e pega o ID da categoria
    const catRes = await request(app)
        .post('/v1/category')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Calçados', slug: 'calcados', use_in_menu: true });
    categoryId = catRes.body.id;
});

afterAll(async () => {
    // Fecha a conexão após os testes
    await sequelize.close();
});

// ========================================
//              Dados do produto
// ========================================
const productData = {
    enabled: true,
    name: 'Tênis Nike Air Max',
    slug: 'tenis-nike-air-max',
    description: 'Tênis Nike Air Max com amortecimento Air Max',
    price: 1299.99,
    price_with_discount: 1299.99,
    stock: 10,
};

// ========================================
//        Dados do produto atualizado
// ========================================
const productDataUpdate = {
    enabled: true,
    name: 'Tênis Nike Air Max - Offer',
    slug: 'tenis-nike-air-max-offer',
    description: 'Tênis Nike Air Max com amortecimento Air Max - Offer',
    price: 1299.99,
    price_with_discount: 999.99,
    stock: 5,
};

// ========================================
// Testes para o Product
// ========================================

describe('Product API', () => {
    // Teste 1: para criar um novo produto
    it('deve criar um novo produto', async () => {
        const res = await request(app)
            .post('/v1/product')
            .set('Authorization', `Bearer ${token}`)
            .send(productData)
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id'); // Verifica se o produto foi criado
        productID = res.body.id; // Salva o ID para os próximos testes
    });

    // Teste 2: para visualizar um produto específico
    it('deve retornar um produto específico', async () => {
        const res = await request(app)
            .get(`/v1/product/${productID}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', productID); // Verifica se o produto foi encontrado
    });

    // Teste 3: para tentar criar um produto com nome existente
    it('deve retornar um erro se o nome já existir', async () => {
        const res = await request(app)
            .post('/v1/product')
            .send(productData);
        expect(res.statusCode).toBe(400);
    });

    // Teste 4: para atualizar um produto
    it('deve atualizar um produto', async () => {
        const res = await request(app)
            .put(`/v1/product/${productID}`)
            .set('Authorization', `Bearer ${token}`)
            .send(productDataUpdate);
        expect(res.statusCode).toBe(204);
    });

    // Teste 5: para verificar se o produto foi atualizado
    it('deve retornar um produto atualizado', async () => {
        const res = await request(app)
            .get(`/v1/product/${productID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe(productDataUpdate.name);
        expect(res.body.description).toBe(productDataUpdate.description);
        expect(res.body.price).toBe(productDataUpdate.price);
    });

    // Teste 6: para deletar um produto
    it('deve deletar um produto', async () => {
        const res = await request(app)
            .delete(`/v1/product/${productID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
    });

    // Teste 7: para validar se o produto foi deletado
    it('deve retornar um erro se o produto não existir', async () => {
        const res = await request(app)
            .get(`/v1/product/${productID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    });

    // Teste 8: para validar o authMiddleware, deletar um produto sem informar o token
    it('deve retornar um erro ao deletar produto se o token não for informado', async () => {
        const res = await request(app)
            .delete(`/v1/product/${productID}`)
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Acesso bloqueado: não foi fornecido um token.'); // Verifica se o erro foi retornado
    });
});