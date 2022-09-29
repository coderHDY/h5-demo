const loading = document.querySelector(".loading");
const wrapper = document.querySelector(".wrapper");
const reloadBtn = document.querySelector(".reload-btn");

let timer = 5;

loading.innerText = timer;
loading.addEventListener("animationstart", (e) => {
  let calcTime = timer;
  loading.innerText = calcTime--;
  const interval = setInterval(() => loading.innerText = calcTime--, 1000);
  setTimeout(() => {
    wrapper.classList.remove("running");
    clearInterval(interval);
  }, (calcTime + 2) * 1000);
})

reloadBtn.addEventListener("click", () => {
  wrapper.classList.add("running");
})