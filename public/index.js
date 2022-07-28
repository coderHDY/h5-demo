"use strict";
const content = document.querySelector(".side-bar");
const iframe = document.querySelector(".content>iframe");


const setSrc = (src) => {
    if (!src || decodeURIComponent(src) === iframe.getAttribute("src")) return;
    iframe.setAttribute("src", decodeURIComponent(src));
}
content.addEventListener('click', (e) => {
    const src = e.target.getAttribute("data-src");
    setSrc(src);
});
content.addEventListener('mousemove', (e) => {
    const src = e.target.getAttribute("data-src");
    setSrc(src);
});

window.addEventListener("load", () => {
    console.log('load');
    const firstSideBar = content?.children[0];
    if (firstSideBar) {
        const src = firstSideBar.getAttribute("data-src");
        setSrc(src);
    }
})