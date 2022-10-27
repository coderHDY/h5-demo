const body = document.body;
const WsServer = "wss://hdy.gh520.xyz/ws";
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

let socket;
const initWS = () => {
    // let socket = new WebSocket("ws://localhost:8888/");
    socket = new WebSocket(WsServer);
    socket.onclose = () => socket = initWS();

    socket.onopen = function () {
        console.log('用websocket与服务器建立连接...');
    };

    socket.onmessage = function (e) {
        const msg = JSON.parse(e.data);
        console.log(msg);
        if (msg?.text) {
            dynamicText(msg.text);
        }
    };
}
initWS();

window.addEventListener("visibilitychange", () => {
    if (!document.hidden && socket.readyState === WebSocket.CLOSED) {
        socket = initWS();
    }
})

setTimeout(() => {
    const msg = JSON.stringify({ text: 'ws连接成功' });
    socket.send(msg);
}, 2000);

const dynamicText = (text) => {
    const span = document.createElement("span");
    span.classList.add("dynamic");
    span.style.top = `${Math.random() * 80 + 10}vh`;
    span.style.animationDuration = `${Math.random() * 5 + 5}s`;
    span.innerText = text;
    document.body.appendChild(span);
    setTimeout(() => {
        document.body.removeChild(span);
    }, 10000);
}