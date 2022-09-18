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
sideBar.addEventListener('click', (e) => {
    const src = e.target.getAttribute("data-src");
    if (!src) return;
    setSrc(src);
    Array.prototype.forEach.call(sideBar.children, item => item.classList[e.target === item ? "add" : "remove"]("active"));
});

sideBar.children[0].classList.add("active");

window.addEventListener("load", () => {
    const hash = location.hash;
    if (hash) return setSrc(hash.slice(1));
    const firstSideBar = sideBar?.children[0];
    if (firstSideBar) {
        const src = firstSideBar.getAttribute("data-src");
        setSrc(src);
    }
})

iframe.addEventListener('load', () => {
    isLoading.val = false;
})
