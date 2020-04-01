import { handleNewUser, handleByeUser } from './notifications';
import { handleReceiveMessage } from './chat';

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
  aSocket.on(events.receiveMessage, handleReceiveMessage); //본인 이외 다른 유저에게 보여질 메시지 소켓
};
