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

  // 실시간 paint 시작좌표
  socket.on(events.beginPath, ({ x, y }) => {
    broadcast(events.beganPath, { x, y });
  });
  // 실시간 paint 그리기
  socket.on(events.strokePath, ({ x, y }) => {
    broadcast(events.strokedPath, { x, y });
  });
  // 실시간 color
  socket.on(events.getColor, ({ getColor }) => {
    broadcast(events.setColor, { color: getColor });
  });
  // 실시간 background color
  socket.on(events.getFillColor, ({ getColor }) => {
    broadcast(events.setFillColor, { color: getColor });
  });
};

export default socketController;
