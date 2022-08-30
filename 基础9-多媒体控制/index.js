const controllerWrapper = document.querySelector(".audio-controller");
const controllers = controllerWrapper.querySelectorAll(".controller");
const audio = document.querySelector("audio");

controllerWrapper.addEventListener("click", (e) => {
  const src = e.target.getAttribute("data-src");
  if (!src || src === audio.getAttribute("src")) return;
  audio.src = src;
});