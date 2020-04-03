import { handleNewUser, handleByeUser } from './notifications';
import { handleReceiveMessage } from './chat';
import { handleBeganPath, handleStrokedPath, handleSetColor, handleSetFillColor } from './paint';

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
  aSocket.on(events.beganPath, handleBeganPath); // 마우스 업상태에서 시작좌표 지점
  aSocket.on(events.strokedPath, handleStrokedPath); // 마우스 다운상태에서 라인 그리기
  aSocket.on(events.setColor, handleSetColor); // 컬러 공유
  aSocket.on(events.setFillColor, handleSetFillColor);
};
