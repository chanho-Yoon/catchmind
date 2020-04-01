import { getSocket } from './sockets';

const messages = document.getElementById('jsMessages');
const sendMessage = document.getElementById('jsSendMessage');

const appendMessage = (text, nickname) => {
  const li = document.createElement('li');
  li.className = `${nickname ? 'out' : 'self'}`;
  li.innerHTML = `
  <span class="author ${nickname ? 'out' : 'self'}">${nickname ? nickname + ' : ' + text : text} </span> 
  `;
  messages.appendChild(li);
  messages.scrollTop = messages.scrollHeight;
};

const handleSendMessage = event => {
  event.preventDefault();
  const input = sendMessage.querySelector('input');
  const value = input.value;
  input.value = '';
  appendMessage(value);

  // 나 이외 전체 사용자에게 broadcast
  const socket = getSocket();
  socket.message = value;
  socket.emit(window.events.setMessage, { message: value });
};

if (sendMessage) {
  sendMessage.addEventListener('submit', handleSendMessage);
}

// 본인 이외에 유저가 보낸 메시지를 받음
export const handleReceiveMessage = ({ nickname, message }) => {
  appendMessage(message, nickname);
};
