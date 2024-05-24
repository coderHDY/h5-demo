const ipt = document.querySelector(".ipt");
const submit = document.querySelector(".submit");
const wsUrl = "http://121.40.31.166:8070/ws/msg";
// const wsUrl = "http://localhost:8070/ws/msg";
// const wsUrl = "http://47.92.141.56:8070/ws/msg?m={msg}";

const send = () => {
  const val = ipt.value;
  const msg = JSON.stringify({ text: val });
  fetch(wsUrl, {
    method: "post",
    body: JSON.stringify({
      type: "text",
      content: ipt.value,
    }),
    headers: { "Content-Type": "application/json" },
  })
    .then((res) => res.json())
    .then((res) => console.log(res));

  fetch(wsUrl.replace("{msg}", msg)).catch((e) => {});
  ipt.value = "";
};

submit.addEventListener("click", send);

ipt.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    send();
  }
});
