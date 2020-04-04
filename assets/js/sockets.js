import { handleNewUser, handleByeUser } from './notifications';
import { handleReceiveMessage } from './chat';
import { handleBeganPath, handleStrokedPath, handleSetColor, handleSetFillColor } from './paint';
import { handlePlayerUpdate } from './players';

let socket = null;

export const getSocket = () => socket;

// 로그인 한 시점에 socket을 시작하도록
export const initSockets = (aSocket) => {
  const { events } = window;
  socket = aSocket;
  socket.on(events.newUser, handleNewUser);
  socket.on(events.byeUser, handleByeUser);
  socket.on(events.receiveMessage, handleReceiveMessage); //본인 이외 다른 유저에게 보여질 메시지 소켓
  socket.on(events.beganPath, handleBeganPath); // 마우스 업상태에서 시작좌표 지점
  socket.on(events.strokedPath, handleStrokedPath); // 마우스 다운상태에서 라인 그리기
  socket.on(events.setColor, handleSetColor); // 라인 컬러
  socket.on(events.setFillColor, handleSetFillColor); // 배경 컬러
  socket.on(events.playerUpdate, handlePlayerUpdate);
};
