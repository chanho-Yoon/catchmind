import { disableCanvas, hideControls, enableCanvas, showControls, showWord, hideWord, resetCanvas } from './paint';

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
};
export const handleLeaderNotification = ({ word }) => {
  enableCanvas();
  showControls();
  showWord();
  setNotifs(`<span>${word}</span>`);
};

export const handleGameEnded = () => {
  setNotifs('게임 끝👍🏻');
  showWord();
  resetCanvas();
};
