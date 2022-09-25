const font = document.querySelector(".font");
const speed = document.querySelector(".speed");

// 垃圾写法
// const letter = "We love programming!   ";
// let showIdx = 1;
// let timer = new Proxy({val: 1, interval: null}, {
//   set(target, p, v) {
//     if (p !== "val") return;

//     clearInterval(target.interval);
//     target.interval = setInterval(() => {
//       showIdx = showIdx === letter.length ? 1 : showIdx + 1;
//       font.innerText = letter.slice(0, showIdx);
//     }, 1000 / v);

//     speed.value = v;
//     Reflect.set(target, p, v);
//   }
// });
// timer.val = 5;

// speed.addEventListener("change", (e) => timer.val = e.target.value);

const letter = "We love programming!   ";
let timer = 5;
let showIdx = 1;

const writeText = () => {
  font.innerText = letter.slice(0, showIdx);
  showIdx = showIdx >= letter.length ? 1 : showIdx + 1;
  setTimeout(writeText, 1000 / timer);
}
writeText();

speed.addEventListener("click", (e) => timer = e.target.value);