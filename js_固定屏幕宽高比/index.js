const html = document.querySelector("html");
const body = document.querySelector("body");

// container 比例
const rateWidth = 600;
const rateHeight = 600;

body.style.padding = 0;
body.style.margin = 0;
html.style.height = `${rateHeight}px`;
html.style.width = `${rateWidth}px`;
html.style.padding = 0;
html.style.position = "fixed";
html.style.left = "50%";
html.style.top = "50%";
html.style.transform = "scale(1) translate(-50%, -50%)";
html.style.transformOrigin = "0% 0%";

const onResize = () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const wRate = w / rateWidth;
  const hRate = h / rateHeight;
  const scale = wRate > hRate ? hRate : wRate;
  html.style.transform = `scale(${scale}) translate(-50%, -50%)`;
};

window.addEventListener("resize", onResize);
onResize();
