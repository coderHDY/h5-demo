const body = document.body;

const goToFullScreen = (element = document.body) => {
    console.log(element);
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
};

body.addEventListener("click", () => goToFullScreen());

// ws://hdy.gh520.xyz:8888/ws
let socket = new WebSocket("ws://localhost:8888/");
socket.onopen = function () {
    console.log('用websocket与服务器建立连接...');
};

socket.onmessage = function (e) {
    const msg = JSON.parse(e.data);
    if (msg?.text) {
        dynamicText(msg.text);
    }
};

setTimeout(() => {
    const msg = JSON.stringify({ text: 'ws连接成功' });
    socket.send(msg);
}, 2000);

const dynamicText = (text) => {
    const span = document.createElement("span");
    span.classList.add("dynamic");
    span.style.top = `${Math.random() * 80 + 10}vh`
    span.innerText = text;
    document.body.appendChild(span);
    setTimeout(() => {
        document.body.removeChild(span);
    }, 5000);
}