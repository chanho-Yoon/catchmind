import { disableCanvas, hideControls, enableCanvas, showControls, showWord, hideWord, resetCanvas } from './paint';
import { disableChat, enableChat } from './chat';

const board = document.getElementById('jsPlayerBoard');
const notifs = document.getElementById('jsWords');

const addPlayers = (players) => {
  board.innerHTML = '';
  players.forEach((player) => {
    const playerElemnet = document.createElement('span');
    playerElemnet.innerText = `${player.nickname}: ${player.points}`;
    board.appendChild(playerElemnet);
  });
};

const setNotifs = (text) => {
  notifs.innerHTML = '';
  notifs.innerHTML = text;
};

export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
//방장 이외에는 canvas 이벤트 동작을 막음
export const handleGameStart = () => {
  setNotifs();
  disableCanvas();
  hideControls();
  hideWord();
  enableChat();
};
export const handleLeaderNotification = ({ word }) => {
  enableCanvas();
  showControls();
  showWord();
  disableChat();
  setNotifs(`<span>${word}</span>`);
};

export const handleGameEnded = () => {
  setNotifs('게임 끝👍🏻');
  showWord();
  resetCanvas();
};

export const handleGameStarting = () => {
  showWord();
  setNotifs('곧 게임이 시작 됩니다.');
};

// 정답 나왔을 시 알림
export const handleAnswerNotification = ({ message }) => {
  showWord();
  setNotifs(`<span>${message}</span>`);
};
