const canvas = document.querySelector(".canvas");
const sizeDown = document.querySelector(".size-down");
const sizeShow = document.querySelector(".size-show");
const sizeAdd = document.querySelector(".size-add");
const colorControler = document.querySelector(".color-controler");
const clear = document.querySelector(".clear");

const ctx = canvas.getContext("2d");
const canvasOptions = new Proxy({
    isControl: false,
    size: 5,
    color: "#000000",
  }, {
    set(target, p, v) {
      switch (p) {
        case "size": {
          if (+v < 1) v = 1;
          sizeShow.innerText = v;
          ctx.lineWidth = +v;
          break;
        };
        case "color": {
          ctx.strokeStyle = v;
          break;
        }
      }
      Reflect.set(target, p, v);
    }
  }
);

ctx.lineWidth = canvasOptions.size;
ctx.strokeStyle = canvasOptions.color;
ctx.lineCap = "round";

const mouseDown = (e) => {
  canvasOptions.isControl = true;
  const { offsetX: x, offsetY: y } = e;
  ctx.beginPath();
  ctx.moveTo(x, y);
}
const mouseUp = () => {
  canvasOptions.isControl = false;
}
const mouseMove = (e) => {
  if (!canvasOptions.isControl) return;
  const { offsetX: x, offsetY: y } = e;
  ctx.lineTo(x, y);
  ctx.stroke();
}

const clearRect = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
canvas.addEventListener('mousedown', mouseDown);
canvas.addEventListener('mouseup', mouseUp);
canvas.addEventListener('mousemove', mouseMove);
clear.addEventListener('click', clearRect);

sizeDown.addEventListener("click", () => canvasOptions.size--);
sizeAdd.addEventListener("click", () => canvasOptions.size++);
colorControler.addEventListener("change", (e) => canvasOptions.color = e.target.value);