const BASE_URL = "https://hdy.gh520.xyz";

const chatRobot = async (val) => await (await fetch(`${BASE_URL}/api/robot/${val}`, {
    method: "GET",
})).json();

export {
    chatRobot
}