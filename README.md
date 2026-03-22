# 🛒 Drip Store - API Backend

Este repositório contém a infraestrutura de Back-end em **Node.js** desenvolvida como parte oficial do **Bootcamp Geração Tech 3.0** (Digital College). 

Esta API RESTful foi desenhada sob a arquitetura **MVC** para fornecer o motor completo de catálogo de produtos, filtragem avançada de vitrine e sistema de segurança (Login JWT) para o nosso Front-end (React).

## 🛠️ Tecnologias Utilizadas
- **Node.js & Express:** Roteamento rápido e construção do servidor central.
- **Sequelize ORM & MySQL:** Modelagem Orientada a Objetos para o banco de dados relacional.
- **JSON Web Token (JWT) & Bcrypt:** Autenticação e bloqueio de rotas privadas via criptografia.
- **Dotenv:** Proteção e ocultamento de variáveis de ambiente sensíveis à Nuvem.
- **Nodemon:** Hot-reloading imersivo durante o desenvolvimento.

## 📂 Arquitetura de Pastas (Padrão MVC)
O projeto foi particionado focando a alta responsabilidade única de cada camada:
```text
├── src/
│   ├── config/       # Chaves e ponteiros de acesso ao Banco de Dados (database.js)
│   ├── controllers/  # Cérebro da aplicação (Regras de negócio, cálculos, Models)
│   ├── middleware/   # Catraca de Segurança (Validação de JWT Header)
│   ├── migrations/   # Histórico arquitetural (Geração das Tabelas via CLI)
│   ├── models/       # Definição das Entidades (User, Category, Product)
│   ├── routes/       # Portas de Entrada da API mapeadas por verbos HTTP
│   └── server.js     # Inicializador mestre do Servidor Express
├── .env              # (Oculto) Senhas Locais
└── .sequelizerc      # Mapa de direcionamento auxiliar
```

## 🔐 End-Points e Rotas Protegidas
O motor do Drip Store divide as requisições em duas esferas claras de segurança:

### 🟢 Rotas Públicas (Vitrine Aberta)
- `GET /v1/product/search` (Busca Inteligente por limite, offset de página e Match de Lupa)
- `GET /v1/product/:id` (Apresentação detalhada da galeria do produto e SKU/Opções)
- `GET /v1/category/search` (Apresenta o Menu Dinâmico)
- `POST /v1/user` (Cadastra novo cliente)
- `POST /v1/user/token` (Gera o crachá local do cliente logado)

### 🔴 Rotas Privadas (Exigem Header `Authorization: Bearer <Token>`)
- `POST`, `PUT`, `DELETE` /v1/product (Permite ao Administrador gerenciar a loja)
- `POST`, `PUT`, `DELETE` /v1/category (Cria novas partições de venda)
- `PUT`, `DELETE` /v1/user (Gestão de perfis e direitos)

---

## 🚀 Como Rodar o Projeto na sua Máquina

1. Clone o repositório na sua máquina local:
```bash
git clone https://github.com/weberfern/projeto-final-gtech-backend.git
```

2. Instale as dependências limpas do NodeJS:
```bash
cd projeto-final-gtech-backend
npm install
```

3. Base de Dados:
- Crie um arquivo em branco chamado `.env` na raiz do seu projeto espelhando as variáveis de conexão com o seu **MySQL local**:
```env
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=drip_store_db
JWT_SECRET=SuaChaveSuperSecreta
```
- Rode as *Migrations* no diretório local para espelhar as Tabelas em branco no seu DBeaver/Workbench:
```bash
npx sequelize-cli db:migrate
```

4. Ligue a Chave de Ignição:
```bash
npm start
```
O servidor começará a escutar requisições do seu Front-end na porta `http://localhost:3000/v1/status`.

---

## 📸 Demonstração de Testes do Servidor (Postman / ThunderClient)

Abaixo as respostas mapeando a eficiência e o design dos Models, retornando com fluidez as requisições:

### Visualização de Token gerado com JWT
<p align="center">
  <img src="images/image (1).png" width="100%" />
</p>

### Proteção de Middleware JWT - 401 Unauthorized
<p align="center">
  <img src="images/image (2).png" width="100%" />
</p>

### Retorno de erro informando categoria não autorizada (Token validado)
<p align="center">
  <img src="images/image (3).png" width="100%" />
</p>

<p align="center">Desenvolvido por Weber Fernandes durante a Formação Digital College.</p>
