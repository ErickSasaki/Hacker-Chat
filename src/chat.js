let socket = io();
// Gera um nickname random
let userName = `Usuário-${Math.floor(Math.random() * 10000)}`;

// Recebe a mensagem do servidor e chama a função que renderiza na tela.
socket.on('emitMessage', (message) => {
    renderMessage(message);
});

init();

/**
 * Será chamada quando o usuário entra na página.
 */
function init() {
    userName = prompt('Insira seu nome de usuário', userName) || userName;

    socket.on('previousMessages', (messageHistory) => {
        messageHistory.forEach((message) => {
            // Verifica se alguma mensagem é do usuário logado
            if (message.userName === userName) {
                message.userName = 'Você';
            }

            renderMessage(message);
        });
    });
}

/**
 * Trata a emissão do form, no caso receberá a mensagem digitada.
 * @param event Evento onSubmit do form.
 */
function receiveMessage(event) {
    const message = getValue('messageInput');
    
    // Remove o efeito padrão do evento submit.
    event.preventDefault();

    // Caso não tenha mensagem para aqui.
    if (!message) return;
    
    // Emite a mensagem para o servidor.
    socket.emit('message', { userName, message });

    clearValue('messageInput');

    renderMessage({ userName: 'Você', message });
}

/**
 * Renderiza a mensagem e quem mandou ela na tela.
 * @param message 
 */
function renderMessage(messageObject) {
    // Recupera a lista do html.
    const list = document.getElementById('messages');

    // Cria uma 'linha' de lista.
    const li = document.createElement('li');
    // Coloca a mensagem dentro da linha.
    li.innerHTML = `${messageObject.userName}:<br>${messageObject.message}`;
    
    // Caso a mensagem seja do usuário mostrará a direita.
    messageObject.userName === 'Você' ? li.style.alignSelf = 'flex-end' : '';

    // Coloca a linha dentro da lista.
    list.prepend(li);
}

/**
 * Recupera o valor de um elemento html.
 * @param {string} elementId Id do elemento
 */
function getValue(elementId) {
    return document.getElementById(elementId).value;
}

/**
 * Remove o valor de um elemento html.
 * @param {string} elementId Id do elemento
 */
function clearValue(elementId) {
    document.getElementById(elementId).value = null;
}