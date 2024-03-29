const body = document.body;
const WsServer = "ws://121.40.31.166:8070/ws/screen";
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
    socket = new WebSocket(WsServer);
    socket.onclose = () => socket = initWS();

    socket.onopen = function () {
        console.log('用websocket与服务器建立连接...');
    };

    socket.onmessage = function (e) {
        const msg = JSON.parse(e.data);
        console.log(msg);
        if (msg?.content) {
            dynamicText(msg.content);
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
    const msg = JSON.stringify({ type: "text", content: 'ws连接成功' });
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