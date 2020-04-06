import { getSocket } from './sockets';

const canvas = document.getElementById('jsCanvas');
const controls = document.getElementById('jsControls');
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName('jsColor');
const jsmode = document.getElementById('jsMode');
const canvasWord = document.getElementById('jsWords');
//FILL 눌렀을 시 해당되는 컬러를 적용하기 위한 변수
let getColor = null;

canvas.width = 700;
canvas.height = 600;

//canvas 배경색을 처음에 초기화시켜주지 않아서 아무 색상없이 이미지 저장시 바탕화면이 투명하게 저장됨 이것을 초기화로 해결
ctx.fillStyle = 'white';
ctx.strokeStyle = 'black';
ctx.fillRect(0, 0, 700, 600);
ctx.lineWidth = 2.5;

let painting = false;

const beginPath = (x, y) => {
  ctx.beginPath(); //새로운 선을 그리겠다는 선언
  ctx.moveTo(x, y); //시작 좌표로 시작점
};
const strokedPath = (x, y) => {
  ctx.lineTo(x, y); //끝나는 좌표로 어디까지 그리는지 나타냄
  ctx.stroke(); // stroke()메서드를 사용해야 canvas위에 선이 그려짐
};
function onMouseMove(event) {
  const x = event.offsetX;
  const y = event.offsetY;
  if (painting === false) {
    beginPath(x, y); //마우스가 업 상태일때 시작지점을 알기위해 경로를 알아야함
    getSocket().emit(window.events.beginPath, { x, y });
  } else {
    strokedPath(x, y); //마
    getSocket().emit(window.events.strokePath, { x, y });
  }
}
function stopPainting() {
  console.log('마우스 업');
  painting = false;
}
function startPainting() {
  console.log(' 마우스 다운 ');
  painting = true;
}

const socketSetColor = (color) => {
  ctx.strokeStyle = color;
  document.getElementById('jsChoiceColor').style.backgroundColor = color;
};

function handleColorClick(event) {
  getColor = event.target.style.backgroundColor;
  socketSetColor(getColor);
  getSocket().emit(window.events.getColor, { getColor });
}
//오른쪽 마우스 클릭 막기
function handleRightClick(event) {
  event.preventDefault();
}
//controls__colors
Array.from(colors).forEach((color) => color.addEventListener('click', handleColorClick));

const socketSetFillColor = (getColor) => {
  ctx.fillStyle = getColor;
  ctx.fillRect(0, 0, 700, 600);
};

// canvas 배경 컬러
function handleClickJsmode() {
  socketSetFillColor(getColor);
  getSocket().emit(window.events.getFillColor, { getColor });
}

export const handleBeganPath = ({ x, y }) => beginPath(x, y);
export const handleStrokedPath = ({ x, y }) => strokedPath(x, y);
export const handleSetColor = ({ color }) => socketSetColor(color);
export const handleSetFillColor = ({ color }) => socketSetFillColor(color);

export const enableCanvas = () => {
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', startPainting);
  canvas.addEventListener('mouseup', stopPainting);
  canvas.addEventListener('mouseleave', stopPainting);
  canvas.addEventListener('contextmenu', handleRightClick);
};

export const disableCanvas = () => {
  canvas.removeEventListener('mousemove', onMouseMove);
  canvas.removeEventListener('mousedown', startPainting);
  canvas.removeEventListener('mouseup', stopPainting);
  canvas.removeEventListener('mouseleave', stopPainting);
  canvas.removeEventListener('contextmenu', handleRightClick);
};

export const hideControls = () => (controls.style.opacity = 0);
export const showControls = () => (controls.style.opacity = 1);
export const hideWord = () => (canvasWord.style.display = 'none');
export const showWord = () => (canvasWord.style.display = 'flex');
export const resetCanvas = () => socketSetFillColor('#fff');
if (canvas) {
  jsmode.addEventListener('click', handleClickJsmode);
  hideControls();
}
