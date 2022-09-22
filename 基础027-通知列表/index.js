const notifyList = document.querySelector(".notify-list");
const addNotifyBtn = document.querySelector(".add-notify");

const randomMsg = [
  "今天还没吃饭",
  "今天会下雨",
  "今天有烤肠吃",
  "明天不上班",
  "手机快没电了",
  "琅琊榜今天5:00更新",
]
const randomRgb = () => `rgb(${000}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

const addNotify = () => {
  const notifyDiv = document.createElement("div");
  notifyDiv.style.color = randomRgb();
  notifyDiv.innerText = randomMsg[Math.floor(Math.random() * randomMsg.length)];
  notifyList.append(notifyDiv);
  setTimeout(() => notifyList.removeChild(notifyDiv), 3000);
}

addNotifyBtn.addEventListener("click", addNotify);