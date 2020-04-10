import events from './events';
import { chooseWord } from './words';
// 참여중인 유저 추적
let sockets = [];
let inProgress = false; //false -> 게임 시작
let word = null;
let painter = null; // 문제를 내는 출제자
let timeout = null; // 게임 시간제한
let timeCount = 50; // 게임 남은 시간 50초
let intervalStop = null; // 외부에서 setInterval 정지 시키기 위한 변수 선언
//게임 리더 정하는 랜덤함수
const chooseLeader = () => sockets[Math.floor(Math.random() * sockets.length)];

const socketController = (socket, io) => {
  const broadcast = (event, data) => socket.broadcast.emit(event, data);
  const allBroadcast = (event, data) => io.emit(event, data);
  const sendPlayerUpdate = () => allBroadcast(events.playerUpdate, { sockets });
  // 게임 시작
  const startGame = () => {
    if (sockets.length > 1) {
      if (inProgress === false) {
        timeCount = 50;
        inProgress = true;
        painter = chooseLeader(); //리더 랜덤 선택
        word = chooseWord(); // 단어 랜덤 선택
        allBroadcast(events.gameStarting);
        setTimeout(() => {
          allBroadcast(events.gameStarted), io.to(painter.id).emit(events.leaderNotification, { word });
          intervalStop = setInterval(countTime, 1000);
          timeout = setTimeout(endGame, 50000);
        }, 5000);
      }
    }
  };
  // 게임 방장 진행 남은시간
  const countTime = () => {
    if (timeCount !== 1) {
      timeCount--;
      allBroadcast(events.showTime, { timeCount });
    } else {
      clearInterval(intervalStop);
    }
  };
  const endGame = () => {
    inProgress = false;
    allBroadcast(events.gameEnded);
    if (timeout !== null) {
      clearTimeout(timeout);
      clearInterval(intervalStop);
    }
    setTimeout(() => startGame(), 2000);
  };
  const addPoint = id => {
    sockets = sockets.map(socket => {
      if (socket.id === id) {
        socket.points += 10;
      }
      return socket;
    });
    sendPlayerUpdate();
    endGame();
    clearTimeout(timeout);
  };

  socket.on(events.setNickname, ({ nickname }) => {
    socket.nickname = nickname;
    sockets.push({ id: socket.id, points: 0, nickname: nickname });
    broadcast(events.newUser, { nickname });
    sendPlayerUpdate();
    if (sockets.length === 2) {
      startGame();
    }
  });
  socket.on(events.disconnect, () => {
    // disconnect 한 socket의 nickname을 가지고 있지 않은 socket만 찾음
    sockets = sockets.filter(aSocket => aSocket.id !== socket.id);

    if (sockets.length === 1) {
      endGame();
    } else if (painter) {
      //문제 출제자가 접속을 끊고 나간다면 게임 종료
      if (painter.id === socket.id) {
        endGame();
      }
    }
    clearInterval(intervalStop);
    broadcast(events.byeUser, { nickname: socket.nickname });
    sendPlayerUpdate();
  });
  // 유저가 메시지 입력하면 자신 이외 사용자에게
  socket.on(events.setMessage, ({ message }) => {
    if (message === word) {
      allBroadcast(events.answerNotification, { message: `정답자는 ${socket.nickname} 입니다, 정답은 [ ${word} ]` });
      clearInterval(intervalStop);
      setTimeout(() => addPoint(socket.id), 3000);
    } else {
      broadcast(events.receiveMessage, { message, nickname: socket.nickname });
    }
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
