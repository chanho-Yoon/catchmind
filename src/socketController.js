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
};

export default socketController;
