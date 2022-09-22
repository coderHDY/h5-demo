const nav = document.querySelector(".nav");
const switerContainer = document.querySelector(".switer-container");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const len = document.querySelectorAll(".nav-item").length;

const showIdx = new Proxy({val: 0}, {
  set(target, p, v) {
    if (p !== "val") return;
    if (v < 0) v = len - 1;
    if (v > len - 1) v = 0;
    console.log(v);
    nav.style.top = `-${v}00vh`;
    switerContainer.style.top = `${v}00vh`;
    Reflect.set(target, p, v);
  }
})

prev.addEventListener("click", () => showIdx.val--);
next.addEventListener("click", () => showIdx.val++);