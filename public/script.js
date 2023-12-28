document.addEventListener('DOMContentLoaded', function () {
  const socket = io();

  socket.on('connect', function () {
    socket.emit('join');
  });

  socket.on('message', function (data) {
    const { message, from } = data;
    appendMessage(message, from);
  });

  function appendMessage(message, from) {
    const chatOutput = document.getElementById('chat-output');
    const messageDiv = document.createElement('div');

    if (from === socket.id) {
      messageDiv.className = 'user-message';
      messageDiv.innerText = `You: ${message}`;
    } else {
      messageDiv.className = 'stranger-message';
      messageDiv.innerText = `Stranger: ${message}`;
    }

    chatOutput.appendChild(messageDiv);
  }

  window.sendMessage = function () {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;

    if (message.trim() !== '') {
      appendMessage(message, socket.id);
      socket.emit('message', { message, to: 'stranger' });
      messageInput.value = '';
    }
  };
});
