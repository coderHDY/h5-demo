const container = document.querySelector(".container");

const ROW = 500;
const COLUMN = 500;
const ITEM = 20

for (let i = 0; i < (ROW / ITEM) * (COLUMN / ITEM); i++) {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");
  container.append(itemDiv);
}

container.addEventListener("mousemove", (e) => {
  if (!e.target.classList.contains("item") || e.target.hasAttribute("style")) {
    return;
  }
  tempBgc(e.target);
});

const randomRgb = () => `rgb(255, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;

const tempBgc = (target) => {
  const color = randomRgb();
  const removeColor = () => {
    target.removeAttribute("style");
    target.removeEventListener('mouseleave', removeColor);
  }
  target.setAttribute("style", `background-color: ${color}; box-shadow: 0 0 10px ${color};`)
  target.addEventListener('mouseleave', removeColor);
}