const ipt = document.querySelector(".ipt");
const submit = document.querySelector(".submit");
const wsUrl = "http://localhost:8888/msg?m={msg}";
// const wsUrl = "ws://hdy.gh520.xyz:8888/ws/msg?m={msg}";


submit.addEventListener("click", () => {
    const val = ipt.value;
    const msg = JSON.stringify({ text: val });
    fetch(wsUrl.replace("{msg}", msg)).catch(e => { });
})