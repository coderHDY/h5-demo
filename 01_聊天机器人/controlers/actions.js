import { ipt, msgBox } from "./doms.js";
import { chatRobot } from "./request.js";
import { addListStorage, modelMsg, getStorage } from "./utils.js";
const parseMsg = (val) => {
    const brReg = /\{br\}/gi;
    const faceReg = /\{face:\w+\}/gi;
    val = val.replace(brReg, "<br />");
    val = val.replace(faceReg, "😄");
    return val;
}
const sendRobotMsg = async () => {
    const val = encodeURIComponent(ipt.value);
    if (val.trim() === "") return alert("消息不能为空");
    sendMe(ipt.value);
    addListStorage("robot", modelMsg(ipt.value, "me"));
    ipt.value = "";
    const msg = await chatRobot(val);
    const m = parseMsg(decodeURIComponent(msg.content));
    addListStorage("robot", modelMsg(m, "robot"));
    sendRobot(m);
}
const sendMe = (val) => {
    const el = genMsgEl(val, ["msg", "me"]);
    appendChild(el);
}
const genMsgEl = (val, classList = []) => {
    const msgEl = document.createElement("div");
    msgEl.classList.add(...classList);
    msgEl.innerHTML = typeof val === "string" ? val : val.val;
    return msgEl;
}
const appendChild = (...el) => {
    msgBox.append(...el);
    if (el.length) {
        setTimeout(() => {
            el[el.length - 1].scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
        })
    }
}
const sendRobot = (val) => {
    const robotMsg = genMsgEl(val, ["msg", "robot"]);
    appendChild(robotMsg);
}
const initMsg = (key) => {
    const vals = getStorage(key);
    if (Array.isArray(vals)) {
        appendChild(...vals.map(item => genMsgEl(item, ["msg", item.sender])));
    }
}

export {
    sendRobotMsg,
    initMsg,
}