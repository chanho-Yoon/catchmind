import { getSocket } from './sockets';

const canvas = document.getElementById('jsCanvas');
const ctx = canvas.getContext('2d');
const colors = document.getElementsByClassName('jsColor');
const jsmode = document.getElementById('jsMode');

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

function handleColorClick(event) {
  getColor = event.target.style.backgroundColor;
  ctx.strokeStyle = getColor;
  document.getElementById('jsChoiceColor').style.backgroundColor = getColor;
}
//오른쪽 마우스 클릭 막기
function handleRightClick(event) {
  event.preventDefault();
}
if (canvas) {
  canvas.addEventListener('mousemove', onMouseMove);
  canvas.addEventListener('mousedown', startPainting);
  canvas.addEventListener('mouseup', stopPainting);
  canvas.addEventListener('mouseleave', stopPainting);
  canvas.addEventListener('contextmenu', handleRightClick);
}
//controls__colors
Array.from(colors).forEach(color => color.addEventListener('click', handleColorClick));

function handleClickJsmode() {
  ctx.fillStyle = getColor;
  ctx.fillRect(0, 0, 700, 600);
}

if (jsmode) {
  jsmode.addEventListener('click', handleClickJsmode);
}

export const handleBeganPath = ({ x, y }) => beginPath(x, y);
export const handleStrokedPath = ({ x, y }) => strokedPath(x, y);
