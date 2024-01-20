// 生成日历
const generateDateRaw = () => {
  let date = "";
  for (let i = 1; i <= 12; i++) {
    // TODO 待解决：数字宽度具体不确定，用span先代替
    date += `<span class="month">`;
    for (let i = 1; i <= 31; i++) {
      const d = `${i}`.padStart(2, "0");
      date += `&nbsp;&nbsp;${d}日&nbsp;`;
    }
    date += `</span>`;
  }
  document.querySelector(".calender").innerHTML = date;
};
generateDateRaw();

// 生成task
const generateTasks = () => {
  const taskInfoBox = document.querySelector(".task-info-box");
  const taskBox = document.querySelector(".task-box");

  let taskInfo = "";
  let task = "";
  for (let i = 1; i <= 10000; i++) {
    taskInfo += `<div class="task-info">第${i}个任务</div>`;
    task += `<div class="task"></div>`;
  }
  taskInfoBox.innerHTML = taskInfo;
  taskBox.innerHTML = task;
};
generateTasks();

// 同步滚动
const syncScroll = () => {
  const taskInfoBox = document.querySelector(".task-info-box");
  const taskBox = document.querySelector(".task-box");

  taskInfoBox.addEventListener("scroll", () => {
    taskBox.scrollTop = taskInfoBox.scrollTop;
  });

  taskBox.addEventListener("scroll", () => {
    taskInfoBox.scrollTop = taskBox.scrollTop;
  });
};
syncScroll();