"use strict";
const sideBar = document.querySelector(".side-bar");
const iframe = document.querySelector(".content>iframe");
const loadingEl = document.querySelector(".layout>.loading");

// 代理loading动画
let isLoading = new Proxy(
  { val: true },
  {
    set(target, key, val) {
      loadingEl.style.display = val ? "block" : "none";
      Reflect.set(target, key, val);
      return true;
    },
  }
);

const setSrc = (src) => {
  if (!src || decodeURIComponent(src) === iframe.getAttribute("src")) return;
  isLoading.val = true;
  Array.prototype.forEach.call(sideBar.children, (item) => {
    item.classList[item.getAttribute("data-src") === src ? "add" : "remove"](
      "active"
    );
  });
  location.hash = `#${src}`;
  iframe.setAttribute("src", decodeURIComponent(src));
};
sideBar.addEventListener("click", (e) => {
  const src = e.target.getAttribute("data-src");
  if (!src) return;
  setSrc(src);
});

window.addEventListener("load", () => {
  const hash = location.hash;
  if (hash)
    return setSrc(`${hash.slice(1).replace(/\/index.html/g, "")}/index.html`);
  // 第0个字元素是刷新图标
  const firstSideBar = sideBar?.children[1];
  if (firstSideBar) {
    const src = firstSideBar.getAttribute("data-src");
    setSrc(src);
  }
});

iframe.addEventListener("load", () => {
  isLoading.val = false;
});
// 滚动过头处理测试
sideBar.addEventListener("scroll", (e) => {
  e.preventDefault();
  e.stopImmediatePropagation();
  if (sideBar.scrollTop < -100) window.location.reload();
});
document.documentElement.addEventListener("touchmove", () =>
  e.preventDefault()
);
document.body.addEventListener("touchmove", () => e.preventDefault());

const div100vh = () => {
  const height = window.innerHeight;
  const layoutDiv = document.querySelector("layout");
  layoutDiv.setAttribute("style", `height: ${height}px;`);
};
div100vh();
window.addEventListener("resize", div100vh);
