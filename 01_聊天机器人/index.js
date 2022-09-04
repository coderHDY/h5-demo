const msgBox = document.querySelector(".msg-box");
const ipt = document.querySelector(".ipt");
const send = document.querySelector(".send");
const BASE_URL = "http://169.129.115.80:8888";

const sendMe = (val) => {
  const meMsg = document.createElement("div");
  meMsg.classList.add("msg", "me");
  meMsg.innerText = val;
  appendChild(meMsg);
}
const sendRobot = (val) => {
  const robotMsg = document.createElement("div");
  robotMsg.classList.add("msg", "robot");
  
  robotMsg.innerHTML = initNode(val);
  appendChild(robotMsg);
}
const initNode = (val) => {
  const brReg = /\{br\}/gi;
  const faceReg = /\{face:\w+\}/gi;
  val = val.replace(brReg, "<br />");
  val = val.replace(faceReg, "😄");
  return val;
}
const appendChild = (el) => {
  msgBox.appendChild(el);
  el.scrollIntoView({behavior: "smooth", block: "end", inline: "end"});
}
const sendMsg = async () => {
  const val = encodeURIComponent(ipt.value);
  if (val.trim() === "") return alert("消息不能为空");
  sendMe(ipt.value);
  ipt.value = "";
  const msg = await (await fetch(`${BASE_URL}/api/robot/${val}`, {
    method: "GET",
  })).json();
  sendRobot(decodeURIComponent(msg.content));
}
send.addEventListener("click", sendMsg);
ipt.addEventListener("keydown", (e) => e.keyCode === 13 && sendMsg());