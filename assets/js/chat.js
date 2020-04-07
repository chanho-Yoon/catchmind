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

const handleSendMessage = (event) => {
  event.preventDefault();
  const input = sendMessage.querySelector('input');
  const message = input.value;
  input.value = '';
  appendMessage(message);

  // 나 이외 전체 사용자에게 broadcast
  const socket = getSocket();
  socket.emit(window.events.setMessage, { message: message });
};

if (sendMessage) {
  sendMessage.addEventListener('submit', handleSendMessage);
}

// 본인 이외에 유저가 보낸 메시지를 받음
export const handleReceiveMessage = ({ nickname, message }) => {
  appendMessage(message, nickname);
};

// 방장은 말을 하면 안됨
export const disableChat = () => (sendMessage.style.display = 'none');
export const enableChat = () => (sendMessage.style.display = 'flex');
