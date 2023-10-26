const board = document.querySelector("div.board");

// 大小写
let uppercase = new Proxy(
  { value: false },
  {
    set(target, p, v) {
      const buttons = board.querySelectorAll("button");
      const uppercase = board.querySelector("[role=uppercase");
      if (v === true) {
        buttons.forEach((btn) => (btn.innerText = btn.innerText.toUpperCase()));
        uppercase.setAttribute("style", "background-color: #fff");
      } else {
        buttons.forEach((btn) => (btn.innerText = btn.innerText.toLowerCase()));
        uppercase.removeAttribute("style");
      }
      target[p] = v;
    },
  }
);
const toggleUppercase = () => (uppercase.value = !uppercase.value);

board.addEventListener("click", (e) => {
  const target = e.target;
  const tagName = target.tagName;
  if (tagName.toUpperCase() === "BUTTON") {
    modelValue.value += target.innerText;
    return;
  }
  const role = e.target.role;
  if (role === "uppercase") {
    toggleUppercase();
  }
  if (role === "space") {
    modelValue.value += " ";
  }
  if (role === "delete") {
    modelValue.value = modelValue.value.slice(0, -1);
  }
});

const modelValue = new Proxy(
  { value: "" },
  {
    set(target, p, v) {
      iptRef.value = v;
      target[p] = v;
    },
  }
);

// input框
const iptRef = document.querySelector("#ipt");

// 响应式
(function () {
  const setRootFontSize = () => {
    const dpi = document.documentElement.clientWidth;
    const fontSize = (dpi * 16) / 375; // iphone6上是 100
    document.documentElement.style.fontSize = fontSize + "px";
  };
  setRootFontSize();
  window.addEventListener("resize", setRootFontSize);
})();
