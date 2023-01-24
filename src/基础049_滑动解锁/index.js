const authBox = document.querySelector(".auth-box");
const slideBar = document.querySelector(".slide-bar");
const slideItem = document.querySelector(".slide-item");
const slideKey = document.querySelector(".slide-key");
const tipBox = document.querySelector(".tip");

slideItem.addEventListener("mousedown", (e) => {
    const { offsetX } = e;
    const slideBarRect = slideBar.getBoundingClientRect();
    const slideItemRect = slideItem.getBoundingClientRect();
    let left = 0;
    const mouseMove = (e) => {
        /* 滑动核心：计算正确的显示左偏移量 */
        left = e.clientX - offsetX < slideBarRect.left
            ? 0
            : (e.clientX - offsetX + slideItemRect.width >= slideBarRect.left + slideBarRect.width
                ? slideBarRect.width - slideItemRect.width
                : e.clientX - offsetX - slideBarRect.left
            );

        slideItem.style.left = `${left}px`;
        /* -50% 距左边的距离，--offset-left 为向右偏移量*/
        slideKey.style.left = `calc(-50% - var(--offset-left) + ${left}px)`;
    }
    const mouseUp = (e) => {
        window.removeEventListener("mousemove", mouseMove);
        window.removeEventListener("mouseup", mouseUp);

        /* 验证密码是否正确 */
        const val = (left - slideBarRect.width / 3) / (slideBarRect.width * 2 / 3);
        auth(val);
        resetAuthConfit();

        /* 初始化 */
        slideItem.style.left = `${0}px`;
        slideKey.style.left = `calc(-50% - var(--offset-left) + ${0}px)`;
    }
    window.addEventListener("mousemove", mouseMove);
    window.addEventListener("mouseup", mouseUp);
});

/* 手机事件 */
slideItem.addEventListener("touchstart", (e) => {
    const slideBarRect = slideBar.getBoundingClientRect();
    const slideItemRect = slideItem.getBoundingClientRect();
    const offsetX = e.targetTouches[0].clientX - slideItemRect.x;
    let left = 0;
    const touchMove = (e) => {
        /* 滑动核心：计算正确的显示左偏移量 */
        left = e.targetTouches[0].clientX - offsetX < slideBarRect.left
            ? 0
            : (e.targetTouches[0].clientX - offsetX + slideItemRect.width >= slideBarRect.left + slideBarRect.width
                ? slideBarRect.width - slideItemRect.width
                : e.targetTouches[0].clientX - offsetX - slideBarRect.left
            );

        slideItem.style.left = `${left}px`;
        /* -50% 距左边的距离，--offset-left 为向右偏移量*/
        slideKey.style.left = `calc(-50% - var(--offset-left) + ${left}px)`;
    }
    const touchEnd = () => {
        window.removeEventListener("touchmove", touchMove);
        window.removeEventListener("touchend", touchEnd);

        /* 验证密码是否正确 */
        const val = (left - slideBarRect.width / 3) / (slideBarRect.width * 2 / 3);
        auth(val);
        resetAuthConfit();

        /* 初始化 */
        left = 0;
        slideItem.style.left = `${left}px`;
        slideKey.style.left = `calc(-50% - var(--offset-left) + ${left}px)`;
    }
    window.addEventListener("touchmove", touchMove);
    window.addEventListener("touchend", touchEnd);
});

// 验证
let _offsetLeft = (Math.random() * 85).toFixed(0);
let _offsetTop = (Math.random() * 80).toFixed(0);
const resetAuthConfit = () => {
    _offsetLeft = (Math.random() * 85).toFixed(0);
    _offsetTop = (Math.random() * 80).toFixed(0);
    authBox.style = `
        --slide-left: 0%;
        --offset-top: ${_offsetTop}%;
        --offset-left: ${_offsetLeft}%
    `
}
resetAuthConfit();

/* 接收小数 */
const auth = (val) => {
    if (Math.abs(val * 100 - _offsetLeft) < 2) {
        tipBox.classList.remove("failed");
        tipBox.classList.add("success");
    } else {
        tipBox.classList.remove("success");
        tipBox.classList.add("failed");
    }
}