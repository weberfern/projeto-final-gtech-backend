const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models'); // Importa o sequelize para sync

let token;
let userID;

beforeAll(async () => {
    // Sincroniza o banco de teste, recriando as tabelas (Verificar se no .env o DB_TEST_NAME está configurado corretamente)
    await sequelize.sync({ force: true });

    // Cria o usuário para os testes e salva o ID
    const createRes = await request(app)
        .post('/v1/user')
        .send({
            firstname: 'Test',
            surname: 'User',
            email: 'test.user@example.com',
            password: 'password123',
            confirmPassword: 'password123',
        });
    userID = createRes.body.id;

    // Pega o token para usar nos testes que precisam de autenticação
    const loginRes = await request(app)
        .post('/v1/user/token')
        .send({
            email: 'test.user@example.com',
            password: 'password123',
        });
    token = loginRes.body.token;
});



describe('User API', () => {
    // ========================================
    //              Dados do usuário
    // ========================================
    const userData = {
        firstname: 'Test',
        surname: 'User',
        email: 'test.user@example.com',
        password: 'password123',
        confirmPassword: 'password123',
    };
    // ========================================

    // ========================================
    //     Dados para atualizar usuário
    // ========================================
    const userDataUpdate = {
        firstname: 'Update',
        surname: 'New User',
        email: 'test.userUpdate@update.com',
    };
    // ========================================

    // Teste 1: para visualizar um usuário específico
    it('deve retornar um usuário específico', async () => {
        const res = await request(app)
            .get(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
    });

    // Teste 2: para tentar visualuzar um usuario sem o token
    it('deve retornar um erro ao tentar visualizar um usuário sem o token', async () => {
        const res = await request(app)
            .get(`/v1/user/${userID}`);
        expect(res.statusCode).toBe(400);
    });

    // Teste 3: para tentar criar um usuário com email existente
    it('deve retornar um erro se o email já existir', async () => {
        const res = await request(app)
            .post('/v1/user')
            .send(userData); // Utiliza mesmo email
        expect(res.statusCode).toBe(400);
    });

    // Teste 4: para atualizar um usuário
    it('deve atualizar um usuário', async () => {
        const res = await request(app)
            .put(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`)
            .send(userDataUpdate);
        expect(res.statusCode).toBe(204);
    });

    // Teste 5: para verificar se o usuário foi atualizado
    it('deve retornar um usuário atualizado', async () => {
        const res = await request(app)
            .get(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.firstname).toBe(userDataUpdate.firstname);
        expect(res.body.surname).toBe(userDataUpdate.surname);
        expect(res.body.email).toBe(userDataUpdate.email);
    });

    // Teste 6: para deletar um usuário
    it('deve deletar um usuário', async () => {
        const res = await request(app)
            .delete(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(204);
    });

    // Teste 7: para validar se o usuário foi deletado
    it('deve retornar um erro se o usuário não existir', async () => {
        const res = await request(app)
            .get(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    });

    // Teste 8: para validar o authMiddleware, deletar um usuário sem informar o token
    it('deve retornar um erro ao deletar usuário se o token não for informado', async () => {
        const res = await request(app)
            .delete(`/v1/user/${userID}`)
        expect(res.statusCode).toBe(400);
    });
});