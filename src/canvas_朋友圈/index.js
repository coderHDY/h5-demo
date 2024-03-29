const uploadEl = document.querySelector(".upload");
const canvas = document.querySelector(".photo");
const downloadEl = document.querySelector(".download");
const biggerEl = document.querySelector(".big");
const smallerEl = document.querySelector(".small");
const upEl = document.querySelector(".up");
const leftEl = document.querySelector(".left");
const rightEl = document.querySelector(".right");
const downEl = document.querySelector(".down");

// 9 | 4
const BLOCK_NUM = 4;
const COL_NUM = Math.sqrt(BLOCK_NUM);

let file = null;
let multi = 1.0;
let leftOffset = 0;
let topOffset = 0;

const getCtx = (canvas) => {
  const canvasRect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio;
  const width = canvasRect.width;
  const height = canvasRect.height;

  canvas.style.width = width;
  canvas.style.height = height;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);
  return ctx;
};
const drawImg = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBreakLines();
  // 创建FileReader对象，读取文件数据
  const reader = new FileReader();
  reader.onload = function (event) {
    // 创建Image对象
    const image = new Image();
    image.onload = function () {
      // 设置Canvas的大小与图片一致
      // 在Canvas上绘制图片
      ctx.drawImage(
        image,
        leftOffset,
        topOffset,
        image.width * multi,
        image.height * multi
      );
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
};
const downloadImage = () => {
  // 将Canvas分成9宫格
  const gridWidth = canvas.width / COL_NUM;
  const gridHeight = canvas.height / COL_NUM;
  for (let row = 0; row < COL_NUM; row++) {
    for (let col = 0; col < COL_NUM; col++) {
      // 计算当前格子的坐标和大小
      const x = col * gridWidth;
      const y = row * gridHeight;

      // 创建一个新Canvas，大小与当前格子一致
      const exportCanvas = document.createElement("canvas");
      exportCanvas.width = gridWidth;
      exportCanvas.height = gridHeight;

      // 在新Canvas上绘制当前格子的内容
      const exportCtx = exportCanvas.getContext("2d");
      exportCtx.drawImage(
        canvas,
        x,
        y,
        gridWidth,
        gridHeight,
        0,
        0,
        gridWidth,
        gridHeight
      );


      // 下载方式1:blob下载
      const dataURL = exportCanvas.toBlob((dataURL) => {
        const link = document.createElement("a");
        const url = window.URL.createObjectURL(dataURL);
        link.href = url;
        link.download = "export-" + (row * COL_NUM + col + 1) + ".png";
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
      });

      // 下载方式2:link下载
      // 将导出的图片转换为DataURL格式
      // const dataURL = exportCanvas.toDataURL();

      // 创建一个链接，下载导出的图片
      // const link = document.createElement("a");
      // link.href = dataURL;
      // link.download = "export-" + (row * COL_NUM + col + 1) + ".png";
      // link.click();
      // link.remove();
    }
  }
};
const multiUp = () => {
  multi += 0.1;
};
const multiDown = () => {
  multi -= 0.1;
};
const drawBreakLines = () => {
  ctx.globalCompositeOperation = "xor";
  for (let i = 1; i < COL_NUM; i++) {
    const startX = (canvas.width / COL_NUM) * i;
    const endX = startX;
    const startY = 0;
    const endY = canvas.height;
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  for (let i = 1; i < COL_NUM; i++) {
    const startY = (canvas.height / COL_NUM) * i;
    const endY = startY;
    const startX = 0;
    const endX = canvas.width;
    ctx.beginPath();
    ctx.strokeStyle = "white";
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
};

const ctx = getCtx(canvas);
uploadEl.addEventListener("change", (e) => {
  file = uploadEl.files[0];
  drawImg();
});
downloadEl.addEventListener("click", function () {
  downloadImage();
});
biggerEl.addEventListener("click", function () {
  multiUp();
  drawImg();
});
smallerEl.addEventListener("click", function () {
  multiDown();
  drawImg();
});
upEl.addEventListener("click", function () {
  topOffset -= 10;
  drawImg();
});
leftEl.addEventListener("click", function () {
  leftOffset -= 10;
  drawImg();
});
rightEl.addEventListener("click", function () {
  leftOffset += 10;
  drawImg();
});
downEl.addEventListener("click", function () {
  topOffset += 10;
  drawImg();
});
