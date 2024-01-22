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

// sync scroll
const syncScroll = () => {
  const calender = document.querySelector(".calendar-wrapper");
  const taskScrollRoot = document.querySelector(".row-scroll-root");
  taskScrollRoot.addEventListener("scroll", () => {
    console.log("scroll");
    calender.scrollLeft = taskScrollRoot.scrollLeft;
  });
};

syncScroll();
