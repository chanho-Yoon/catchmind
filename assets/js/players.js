const board = document.getElementById('jsPlayerBoard');

const addPlayers = (players) => {
  board.innerHTML = '';
  players.forEach((player) => {
    const playerElemnet = document.createElement('span');
    playerElemnet.innerText = `${player.nickname}: ${player.points}`;
    board.appendChild(playerElemnet);
  });
};

export const handlePlayerUpdate = ({ sockets }) => addPlayers(sockets);
