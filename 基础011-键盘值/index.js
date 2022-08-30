const codeWrapper = document.querySelector(".code-wrapper");
const c = document.querySelector(".c");
const a = document.querySelector(".a");
const e = document.querySelector(".e");

window.addEventListener("keypress", (event) => {
  if (!codeWrapper.classList.contains("show")) {
    codeWrapper.classList.add("show");
  }
  c.innerText = event.key;
  a.innerText = event.keyCode || event.which;
  e.innerText = event.code;
})