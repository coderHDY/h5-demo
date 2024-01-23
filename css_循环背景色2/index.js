const TASK_HEIGHT = 100;
const TASK_NUM = 1000000;
const OFFSET = 10;

// 生成日历
const generateDateRaw = () => {
  let date = "";
  for (let i = 1; i <= 12; i++) {
    // TODO 待解决：数字宽度具体不确定，用span先代替
    date += `<span class="month" style="z-index: ${i}">${i}月</span>`;
    date += `<span class="days-wrapper">`;
    for (let i = 1; i <= 31; i++) {
      const d = `${i}`.padStart(2, "0");
      date += `&nbsp;${d}日&nbsp&nbsp;`;
    }
    date += `</span>`;
  }
  document.querySelector(".calender").innerHTML = date;
};
generateDateRaw();

// sync scroll
const syncScroll = () => {
  const calender = document.querySelector(".calender");
  const taskScrollRoot = document.querySelector(".row-scroll-root");
  taskScrollRoot.addEventListener("scroll", () => {
    console.log("scroll");
    calender.scrollLeft = taskScrollRoot.scrollLeft;
  });
};

syncScroll();

// 获取窗口高度
const getWindowHeight = () => {
  return window.innerHeight;
};
let windowHeight = getWindowHeight();
window.addEventListener("resize", () => {
  windowHeight = getWindowHeight();
});

// 获取当前屏幕应该开始展示的task
const getStartIndex = (offset = 3) => {
  const taskScrollRoot = document.querySelector(".gant-wrapper");
  const realNum =  Math.floor(taskScrollRoot.scrollTop / TASK_HEIGHT);
  return realNum > offset ? realNum - offset : 0;
};
// 
const getEndIndex = (offset = 3) => {
  const startIdx = getStartIndex(offset);
  return startIdx + offset + getTaskCount() > TASK_NUM ? TASK_NUM : startIdx + offset + getTaskCount();
}
// 获取当前屏幕高度可以展示的task
const getTaskCount = () => {
  return Math.ceil(windowHeight / TASK_HEIGHT);
};
// 上方偏移高度
const getOffsetHeight = (startIndex) => {
  return startIndex * TASK_HEIGHT;
};
// 下方偏移高度
const getOffsetBottom = (endIndex) => {
  return TASK_NUM > endIndex ? (TASK_NUM - endIndex) * TASK_HEIGHT : 0;
};

// 生成task
const generateTask = () => {
  const taskInfoBox = document.querySelector(".task-info-box");
  const taskBox = document.querySelector(".task-box");
  const infos = [];
  const tasks = [];
  const startIdx = getStartIndex(OFFSET);
  const endIdx = getEndIndex(OFFSET);
  const offsetTop = getOffsetHeight(startIdx);
  const offsetBottom = getOffsetBottom(endIdx);
  infos.push(`<div class="placeholder" style="height: ${offsetTop}px;"></div>`);
  tasks.push(`<div class="placeholder" style="height: ${offsetTop}px;"></div>`);
  for (let i = startIdx; i <= endIdx; i++) {
    infos.push(`<div class="task-info">任务${i}</div>`);
    tasks.push(`<div class="task">任务${i}</div>`);
  }
  infos.push(
    `<div class="placeholder" style="height: ${offsetBottom}px;"></div>`
  );
  tasks.push(
    `<div class="placeholder" style="height: ${offsetBottom}px;"></div>`
  );
  taskInfoBox.innerHTML = infos.join("");
  taskBox.innerHTML = tasks.join("");
};
generateTask();

const taskScrollRoot = document.querySelector(".gant-wrapper");
document.querySelector(".gant-wrapper").addEventListener("scroll", () => {
  generateTask();
});
