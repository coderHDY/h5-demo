const BASE_URL = "http://47.92.141.56:8070";
// const BASE_URL = "http://164.88.255.3:8070";

const chatRobot = async (val) => await (await fetch(`${BASE_URL}/api/robot/${val}`, {
    method: "GET",
})).json();

export {
    chatRobot
}