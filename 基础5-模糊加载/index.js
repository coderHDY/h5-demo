const page = document.querySelector(".page");
const progress = document.querySelector(".progress");

const setProgress = (i) => {
    if (i < 0) i = 0;
    if (i > 100) i = 100;
    progress.innerText = `${i}%`;
    page.setAttribute("style", `filter: blur(${scale(i, 0, 100, 30, 0)}px)`);
    progress.setAttribute("style", `opacity: ${scale(i, 0, 100, 0, 30)}`);
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

// 重要：范围转换
const scale = (num, in_min, in_max, out_min, out_max) => num / (in_max - in_min) * (out_max - out_min) + out_min;