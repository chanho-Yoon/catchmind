import { handleNewUser, handleByeUser } from './notifications';

let socket = null;

export const getSocket = () => socket;
export const updateSocket = aSocket => {
  socket = aSocket;
};
// 로그인 한 시점에 socket을 시작하도록
export const initSockets = aSocket => {
  const { events } = window;
  updateSocket(aSocket);
  aSocket.on(events.newUser, handleNewUser);
  aSocket.on(events.byeUser, handleByeUser);
};
