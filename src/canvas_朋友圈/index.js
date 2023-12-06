const uploadEl = document.querySelector(".upload");
const canvas = document.querySelector(".photo");
const downloadEl = document.querySelector(".download");
const biggerEl = document.querySelector(".big");
const smallerEl = document.querySelector(".small");
const upEl = document.querySelector(".up");
const leftEl = document.querySelector(".left");
const rightEl = document.querySelector(".right");
const downEl = document.querySelector(".down");

let file = null;
let multi = 1.0;
let leftOffset = 0;
let topOffset = 0;

uploadEl.addEventListener("change", (e) => {
  file = uploadEl.files[0];
  drawImg();
});

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
const ctx = getCtx(canvas);

const drawImg = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 创建FileReader对象，读取文件数据
  const reader = new FileReader();
  reader.onload = function (event) {
    // 创建Image对象
    const image = new Image();
    image.onload = function () {
      // 设置Canvas的大小与图片一致
      // 在Canvas上绘制图片
      ctx.drawImage(image, leftOffset, topOffset, image.width * multi, image.height * multi);
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(file);
};

const downloadImage = () => {
  // 将Canvas分成9宫格
  const gridWidth = canvas.width / 3;
  const gridHeight = canvas.height / 3;
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
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

      // 将导出的图片转换为DataURL格式
      const dataURL = exportCanvas.toDataURL();

      // 创建一个链接，下载导出的图片
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = "export-" + (row * 3 + col + 1) + ".png";
      link.click();
    }
  }
};
const multiUp = () => {
  multi += 0.1;
}
const multiDown = () => {
  multi -= 0.1;
}

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
