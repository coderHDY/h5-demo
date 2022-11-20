const body = document.body;
const prize = document.querySelector(".prize"); // check
const reset = document.querySelector(".reset"); // check

// callback: (x, y) => void
const moveListener = (el, callback) => {
    let mouseDown = false;
    el.addEventListener("touchmove", e => callback(e.targetTouches[0].clientX, e.targetTouches[0].clientY));
    el.addEventListener("mousedown", () => mouseDown = true);
    el.addEventListener("mouseup", () => mouseDown = false);
    el.addEventListener("mouseout", () => mouseDown = false);
    document.addEventListener("mouseout", () => mouseDown = false);
    el.addEventListener("mousemove", (e) => {
        if (!mouseDown) return;
        callback(e.clientX, e.clientY);
    })
}

let initCanvas = (el) => {
    const width = el.clientWidth;
    const height = el.clientHeight;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.classList.add("canvas");

    // 处理分辨率的问题
    const dpr = window.devicePixelRatio;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr)

    el.append(canvas);

    // 初始化刮奖区
    const reInit = () => {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = "#e5e5e5";
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = "#ffffffff";
        ctx.fillRect(100, 0, 10, height);
        ctx.fillRect(210, 0, 10, height);
        ctx.fillRect(0, 50, width, 10);
        ctx.fillRect(0, 110, width, 10);
        ctx.fillStyle = "#333";
        ctx.font = '30px "微软雅黑"';
        ctx.fillText("刮开有奖", width / 2 - 60, height / 2 + 5);

    }
    reInit();

    // event
    let selectNum = -1;
    canvas.addEventListener("mousedown", (e) => selectNum = getSelectNum(e.x, e.y));
    canvas.addEventListener("touchstart", (e) => selectNum = getSelectNum(e.targetTouches[0].clientX, e.targetTouches[0].clientY));
    const handleTouchMove = (x, y) => {
        if (getSelectNum(x, y) !== selectNum) return;
        const boundingRect = canvas.getBoundingClientRect();
        const touchX = x - boundingRect.left - 5;
        const touchY = y - boundingRect.top - 5;
        ctx.clearRect(touchX, touchY, 10, 10);
    }
    // (x, y) => number
    const getSelectNum = (x, y) => {
        const boundingRect = canvas.getBoundingClientRect();
        const touchX = x - boundingRect.left;
        const touchY = y - boundingRect.top;
        let num = -1
        if (touchX < 105) {
            num = touchY < 55 ? 1 : (touchY < 115 ? 4 : 7);
        } else if (touchX < 215) {
            num = touchY < 55 ? 2 : (touchY < 115 ? 5 : 8);
        } else {
            num = touchY < 55 ? 3 : (touchY < 115 ? 6 : 9);
        }
        return num;
    }
    moveListener(canvas, handleTouchMove);
    return { reInit }
}
const { reInit } = initCanvas(prize);

const resetAll = () => {
    reInit();
    prize.classList.add("hidden");
    setTimeout(() => prize.classList.remove("hidden"), 200);
    const prizeArr = [...prize.children];
    prizeArr.sort(() => Math.random() - 0.5);
    prize.append(...prizeArr);
}
reset.addEventListener("click", resetAll);