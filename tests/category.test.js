const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models');

let token;
let categoryId;

beforeAll(async () => {
    // Sincroniza o banco de teste, recriando as tabelas (Verificar se no .env o DB_TEST_NAME está configurado corretamente)
    await sequelize.sync({ force: true });
    // Cria usuário admin para os testes e em seguida pega o token jwt e armazena na variavel token
    await request(app).post('/v1/user').send({
        firstname: 'Admin', surname: 'Cat', email: 'admin.cat@example.com',
        password: 'password123', confirmPassword: 'password123',
    });
    // Pega o token
    const res = await request(app).post('/v1/user/token').send({
        email: 'admin.cat@example.com', password: 'password123',
    });
    token = res.body.token;
});



describe('Category API', () => {
    // Teste 1: para criar uma categoria
    it('deve criar uma nova categoria', async () => {
        const res = await request(app)
            .post('/v1/category')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Camisetas', slug: 'camisetas', use_in_menu: true });

        expect(res.statusCode).toBe(201);
        categoryId = res.body.id;
    });

    // Teste 2: para tentar criar uma categoria com nome existente
    it('deve retornar um erro se o nome já existir', async () => {
        const res = await request(app)
            .post('/v1/category')
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Camisetas', slug: 'camisetas', use_in_menu: true });
        expect(res.statusCode).toBe(400);
    });

    // Teste 3: para visualizar uma categoria específica
    it('deve retornar uma categoria específica', async () => {
        const res = await request(app)
            .get(`/v1/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('id', categoryId);
    });

    // Teste 4: para atualizar uma categoria
    it('deve atualizar uma categoria', async () => {
        const res = await request(app)
            .put(`/v1/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`)
            .send({ name: 'Camisetas', slug: 'camisetas', use_in_menu: true });
        expect(res.statusCode).toBe(204);
    });

    // Teste 5: para verificar se a categoria foi atualizada
    it('deve retornar uma categoria atualizada', async () => {
        const res = await request(app)
            .get(`/v1/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.name).toBe('Camisetas');
        expect(res.body.slug).toBe('camisetas');
        expect(res.body.use_in_menu).toBe(true);
    });

    // Teste 6: para deletar uma categoria
    it('deve deletar uma categoria', async () => {
        const res = await request(app)
            .delete(`/v1/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(204);
    });

    // Teste 7: para validar se a categoria foi deletada
    it('deve retornar um erro se a categoria não existir', async () => {
        const res = await request(app)
            .get(`/v1/category/${categoryId}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    });

    // Teste 8: para validar o authMiddleware, deletar uma categoria sem informar o token
    it('deve retornar um erro ao deletar categoria se o token não for informado', async () => {
        const res = await request(app)
            .delete(`/v1/category/${categoryId}`)
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('message', 'Acesso bloqueado: não foi fornecido um token.');
    });
});