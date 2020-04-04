import events from './events';
import { chooseWord } from './words';
// 참여중인 유저 추적
let sockets = [];
let inProgress = false; //false -> 게임 시작
let word = null;

//게임 리더 정하는 랜덤함수
const chooseLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const allBroadcast = (event, data) => io.emit(event, data);
  const sendPlayerUpdate = () => allBroadcast(events.playerUpdate, { sockets });
  // 게임 시작
  const startGame = () => {
    if (inProgress === false) {
      inProgress = true;
      const painter = chooseLeader(); //리더 랜덤 선택
      word = chooseWord(); // 단어 랜덤 선택
    }
  };

  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, points: 0, nickname: nickname });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
    startGame();
  });
  socket.on(events.disconnect, ({ nickname }) => {
    // disconnect 한 socket의 nickname을 가지고 있지 않은 socket만 찾음
    sockets = sockets.filter((aSocket) => aSocket.id !== socket.id);
    broadcast(events.byeUser, { nickname: socket.nickname });
    sendPlayerUpdate();
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
