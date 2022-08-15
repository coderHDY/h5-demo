"use strict";
const sideBar = document.querySelector(".side-bar");
const iframe = document.querySelector(".content>iframe");
const loadingEl = document.querySelector(".layout>.loading");

// 代理loading动画
let isLoading = new Proxy({ val: true }, {
    set(target, key, val) {
        loadingEl.style.display = val ? "block" : "none";
        Reflect.set(target, key, val);
        return true;
    }
});

const setSrc = (src) => {
    if (!src || decodeURIComponent(src) === iframe.getAttribute("src")) return;
    isLoading.val = true;
    iframe.setAttribute("src", decodeURIComponent(src));
}
sideBar.addEventListener('click', (e) => {
    const src = e.target.getAttribute("data-src");
    setSrc(src);
});
// sideBar.addEventListener('mousemove', (e) => {
//     const src = e.target.getAttribute("data-src");
//     setSrc(src);
// });
sideBar.addEventListener('click', (e) => {
    const src = e.target.getAttribute("data-src");
    setSrc(src);
});
window.addEventListener("load", () => {
    const firstSideBar = sideBar?.children[0];
    if (firstSideBar) {
        const src = firstSideBar.getAttribute("data-src");
        setSrc(src);
    }
})

iframe.addEventListener('load', () => {
    isLoading.val = false;
})

iframe.onload = () => {
    const script = iframe.contentWindow.document.querySelectorAll("script");
    script.forEach(item => document.body.appendChild(item));
};