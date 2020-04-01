import events from './events';

const socketController = socket => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);

  socket.on(events.setNickname, ({ nickname }) => {
    broadcast(events.newUser, { nickname });
    socket.nickname = nickname;
  });
  socket.on(events.disconnect, ({ nickname }) => {
    broadcast(events.byeUser, { nickname: socket.nickname });
  });
  // 유저가 메시지 입력하면 자신 이외 사용자에게
  socket.on(events.setMessage, ({ message }) => {
    broadcast(events.receiveMessage, { message, nickname: socket.nickname });
  });
};

export default socketController;
