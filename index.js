// Configurações do express.
const express = require('express');
const path = require('path');

const app = express();
const server = require('http').createServer(app);

// Insere socket no projeto
const io = require('socket.io')(server);

// Configurações do express
app.use(express.static(path.join(__dirname, 'src')));
app.set('views', path.join(__dirname, 'src'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use('/', (req, res) => {
    res.render('index.html');
});

// Armazena no servidor as mensagens dos usuários
let messageHistory = [];

// Chamado quando um usuário conecta no servidor
io.on('connection', (socket) => {
    console.log('a user connected');

    // Emite ao cliente as mensagens armazenadas no servidor.
    socket.emit('previousMessages', messageHistory);

    socket.on('disconnect', () => {
        console.log('user disconected');
    });

    // Recebe a mensagem do cliente, armazena no servidor e emite a todos os outros clientes.
    socket.on('message', (message) => {
        messageHistory.push(message);
        socket.broadcast.emit('emitMessage', message);
    });
});

// Inicia o servidor na porta 3000.
server.listen(3001, () => {
    console.log('Server iniciado na porta 3001.');
});