import { ipt, send } from "./doms.js";
import { sendRobotMsg, initMsg } from "./actions.js";
const init = () => {
    initMsg("robot");
    send.addEventListener("click", sendRobotMsg);
    ipt.addEventListener("keydown", (e) => e.keyCode === 13 && sendRobotMsg());
}

export {
    init,
}