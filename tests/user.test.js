const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../src/models'); // Importa o sequelize para sync

beforeAll(async () => {
    // Sincroniza o banco de teste, recriando as tabelas (Verificar se no .env o DB_TEST_NAME está configurado corretamente)
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    // Fecha a conexão após os testes
    await sequelize.close();
});

describe('User API', () => {
    // ========================================
    //              Dados do usuário
    // ========================================
    let token;
    let userID;
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

    // Teste 1: para criar um novo usuário
    it('deve criar um novo usuário', async () => {
        const res = await request(app)
            .post('/v1/user')
            .send(userData);
        expect(res.statusCode).toBe(201);
        userID = res.body.id; // Salva o ID para os próximos testes
    });

    // Teste 2: para visualizar um usuário específico (ID 1)
    it('deve retornar um usuário específico', async () => {
        const res = await request(app)
            .get(`/v1/user/${userID}`);
        expect(res.statusCode).toBe(200);
    });

    // Teste 3: para tentar criar um usuário com email existente
    it('deve retornar um erro se o email já existir', async () => {
        const res = await request(app)
            .post('/v1/user')
            .send(userData); // Utiliza mesmo email
        expect(res.statusCode).toBe(400);
    });

    // Teste 4: para pegar token JWT
    it('deve retornar um token jwt', async () => {
        const res = await request(app)
            .post('/v1/user/token')
            .send({
                email: userData.email,
                password: userData.password,
            });
        expect(res.statusCode).toBe(200);
        token = res.body.token;
    });

    // Teste 5: para atualizar um usuário
    it('deve atualizar um usuário', async () => {
        const res = await request(app)
            .put(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`)
            .send(userDataUpdate);
        expect(res.statusCode).toBe(204);
    });

    // Teste 6: para verificar se o usuário foi atualizado
    it('deve retornar um usuário atualizado', async () => {
        const res = await request(app)
            .get(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.firstname).toBe(userDataUpdate.firstname);
        expect(res.body.surname).toBe(userDataUpdate.surname);
        expect(res.body.email).toBe(userDataUpdate.email);
    });

    // Teste 7: para deletar um usuário
    it('deve deletar um usuário', async () => {
        const res = await request(app)
            .delete(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toBe(204);
    });

    // Teste 8: para validar se o usuário foi deletado
    it('deve retornar um erro se o usuário não existir', async () => {
        const res = await request(app)
            .get(`/v1/user/${userID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toBe(404);
    });

    // Teste 9: para validar o authMiddleware, deletar um usuário sem informar o token
    it('deve retornar um erro ao deletar usuário se o token não for informado', async () => {
        const res = await request(app)
            .delete(`/v1/user/${userID}`)
        expect(res.statusCode).toBe(400);
    });
});