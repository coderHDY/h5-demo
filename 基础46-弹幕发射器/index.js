const ipt = document.querySelector(".ipt");
const submit = document.querySelector(".submit");
// const wsUrl = "http://localhost:8888/msg?m={msg}";
const wsUrl = "https://hdy.gh520.xyz/ws/msg?m={msg}";

const send = () => {
    const val = ipt.value;
    const msg = JSON.stringify({ text: val });
    fetch(wsUrl.replace("{msg}", msg)).catch(e => { });
    ipt.value = "";
}

submit.addEventListener("click", send);

ipt.addEventListener("keyup", e => {
    if (e.keyCode === 13) {
        send();
    }
})