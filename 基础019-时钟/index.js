const modeController = document.querySelector(".mode-controller");
const body = document.querySelector("body");
const hour = document.querySelector(".hour");
const minute = document.querySelector(".minute");
const second = document.querySelector(".second");
const weekday = document.querySelector(".weekday");
const month = document.querySelector(".month");
const day = document.querySelector(".day");
const timeList = document.querySelector(".time-list");

modeController.addEventListener("click", () => body.classList.toggle("dark"));

const timeStep = 360 / 60;
const hourStep = 360 / 12;
const weekArr = [
    '星期天',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
];

const getElDeg = el => {
    const rotate = el.style.transform;
    const reg = /(?<=rotate\()\d+(?=deg\))/;
    return +reg.exec(rotate)?.[0];
};

const setDate = () => {
    const date = new Date();
    const hourTime = date.getHours();
    const minuteTime = date.getMinutes();
    const secondTime = date.getSeconds();
    const monthNum = date.getMonth();
    const dateNum = date.getDate();
    const weekNum = date.getDay();

    let hourDeg = getElDeg(hour);
    let minuteDeg = getElDeg(minute);
    let secondDeg = getElDeg(second);
    hourDeg = (Number.isNaN(hourDeg) || (Math.floor(hourDeg / hourStep % 12) === hourTime % 12) ? hourTime * hourStep : hourDeg + hourStep);
    minuteDeg = Number.isNaN(minuteDeg) ? timeStep * minuteTime : (minuteDeg / timeStep % 60 === minuteTime ? minuteDeg : minuteDeg + timeStep);
    secondDeg = Number.isNaN(secondDeg) ? timeStep * secondTime : (secondDeg / timeStep % 60 === secondTime ? secondDeg : secondDeg + timeStep);
    hourDeg += minuteDeg % 360 / 360 * hourStep;

    hour.setAttribute("style", `transform: rotate(${hourDeg}deg)`);
    minute.setAttribute("style", `transform: rotate(${minuteDeg}deg)`);
    second.setAttribute("style", `transform: rotate(${secondDeg}deg)`);
    month.innerText = monthNum + 1;
    day.innerText = dateNum;
    weekday.innerText = weekArr[weekNum];
    timeList.innerText = `${`${hourTime}`.padStart(2, 0)}:${`${minuteTime}`.padStart(2, 0)}`;
};

setDate();
setInterval(setDate, 1000);