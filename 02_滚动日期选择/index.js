const yearWrapper = document.querySelector(".year");
const monthWrapper = document.querySelector(".month");
const dayWrapper = document.querySelector(".day");

let pickedYear = new Date().getFullYear();
let pickedMonth = 0;
let pickedDay = 1;

const setDay = () => {
  const { scrollTop, children } = dayWrapper;
  const itemHeight = 16 * 1.5;
  const center = scrollTop + itemHeight;
  const centerItem = children[Math.round(center / itemHeight)];
  pickedDay = centerItem.innerText;
  console.log(`${pickedYear}-${pickedMonth}-${pickedDay}`);
};

const addPlaceholderItem = (el, num) => {
  for (let i = 0; i < num; i++) {
    const dom = document.createElement("div");
    dom.classList.add("placeholderItem");
    el.appendChild(dom);
  }
};

const initYear = () => {
  addPlaceholderItem(yearWrapper, 1);
  const year = new Date().getFullYear();
  for (let y = year - 100; y < year + 100; y++) {
    const yearDom = document.createElement("div");
    yearDom.classList.add("yearItem");
    yearDom.innerText = y;
    yearWrapper.appendChild(yearDom);
  }
  addPlaceholderItem(yearWrapper, 1);
};
const initMonth = () => {
  addPlaceholderItem(monthWrapper, 1);
  for (let m = 1; m <= 12; m++) {
    const monthDom = document.createElement("div");
    monthDom.classList.add("monthItem");
    monthDom.innerText = m;
    monthWrapper.appendChild(monthDom);
  }
  addPlaceholderItem(monthWrapper, 1);
};
const initDay = () => {
  while (dayWrapper.firstChild) {
    dayWrapper.removeChild(dayWrapper.firstChild);
  }
  addPlaceholderItem(dayWrapper, 1);
  const dayOfMonth = new Date(pickedYear, pickedMonth, 0).getDate();
  for (let d = 1; d <= dayOfMonth; d++) {
    const dayDom = document.createElement("div");
    dayDom.classList.add("dayItem");
    dayDom.innerText = d;
    dayWrapper.appendChild(dayDom);
  }
  addPlaceholderItem(dayWrapper, 1);
  setDay();
};

initYear();
initMonth();
initDay();

// eventListener
const yearScroll = () => {
  let timer = null;
  return (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      const { scrollTop, children } = yearWrapper;
      const itemHeight = 16 * 1.5;
      const center = scrollTop + itemHeight;
      const centerItem = children[Math.round(center / itemHeight)];
      pickedYear = centerItem.innerText;
      initDay();
      console.log(`${pickedYear}-${pickedMonth}-${pickedDay}`);
    }, 100);
  };
};
const monthScroll = () => {
  let timer = null;
  return (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      const { scrollTop, children } = monthWrapper;
      const itemHeight = 16 * 1.5;
      const center = scrollTop + itemHeight;
      const centerItem = children[Math.round(center / itemHeight)];
      pickedMonth = centerItem.innerText;
      initDay();
      console.log(`${pickedYear}-${pickedMonth}-${pickedDay}`);
    }, 100);
  };
};
const dayScroll = () => {
  let timer = null;
  return (e) => {
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(setDay, 100);
  };
};

yearWrapper.addEventListener("scroll", yearScroll());
monthWrapper.addEventListener("scroll", monthScroll());
dayWrapper.addEventListener("scroll", dayScroll());
