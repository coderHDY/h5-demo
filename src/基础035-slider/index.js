const container = document.querySelector(".container");
const slider = document.querySelector(".slider");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

const ImgWidth = 500;
const ImgNum = 4;

const showIdx = new Proxy({val: 0}, {
  set(target, p, v) {
    if (p !== "val") return false;
    if (v >= ImgNum) v = 0;
    if (v < 0) v = ImgNum - 1;

    slider.style.left = `-${v * ImgWidth}px`;
    Reflect.set(target, p, v);
  }
})

prev.addEventListener("click", () => showIdx.val--);
next.addEventListener("click", () => showIdx.val++);
