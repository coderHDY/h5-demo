const page = document.querySelector(".page");
const progress = document.querySelector(".progress");

const setProgress = (i) => {
    if (i < 0) i = 0;
    if (i > 100) i = 100;
    progress.innerText = `${i}%`;
    page.setAttribute("style", `filter: blur(${100 - i}px)`);
    progress.setAttribute("style", `opacity: ${i < 80 ? 1 : 1 - (i - 80) / 20}`);
}

let p = 0;
(() => {
    let i = setInterval(() => {
        setProgress(p++);
        if (p > 100) {
            clearInterval(i);
            i = null;
        }
    }, 30)
})()