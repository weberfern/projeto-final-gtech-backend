const app = require('./app');
const port = 3000;

// Iniciando o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
})