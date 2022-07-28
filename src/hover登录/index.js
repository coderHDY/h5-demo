const shadow = document.querySelector('.shadow-bgc ');
const loginWrapper = document.querySelector('.login-wrapper');
let inTime;
let outTime;

function mouseIn(e) {
    inTime = Date.now();
    shadow.style.left = `${e.clientX - loginWrapper.offsetLeft}px`;
    shadow.style.top = `${e.clientY - loginWrapper.offsetTop}px`;
    shadow.classList.remove("out");
    shadow.classList.add("in");
}

function mouseOut(e) {
    shadow.classList.remove("in");
    shadow.style.left = `${e.clientX - loginWrapper.offsetLeft}px`;
    shadow.style.top = `${e.clientY - loginWrapper.offsetTop}px`;
    shadow.classList.add("out");
}

loginWrapper.addEventListener('mouseenter', mouseIn);
loginWrapper.addEventListener('mouseleave', (e) => {
    outTime = Date.now();
    if (outTime - inTime < 500) {
        setTimeout((e) => {
            if (inTime < outTime) {
                mouseOut(e);
            }
        }, 500, e);
    } else {
        mouseOut(e);
    }
});