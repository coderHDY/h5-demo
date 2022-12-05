const wipers = document.querySelector(".wipers");



const listener = (el = document.body) => {
  let scrollHeight = el.scrollHeight;
  let clientHeight = window.innerHeight;
  let height = scrollHeight - clientHeight;
  const randomRgb = () => `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
  window.addEventListener("resize", () => {
    scrollHeight = el.scrollHeight;
    clientHeight = window.innerHeight;
    height = scrollHeight - clientHeight;
  })
  window.addEventListener("scroll", (e) => {
    const r = (document.documentElement.scrollTop / height) * 180;
    wipers.style.transform = `rotate(${r}deg)`;
    const color = randomRgb();
    wipers.style.background = `linear-gradient(to left, ${color} 0%, #fff 100%)`;
  })
}
listener();