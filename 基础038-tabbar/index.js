const tabbar = document.querySelector(".tabbar");
const container = document.querySelector(".container");

const routerGo = (linkId) => {
  Array.prototype.forEach.call(tabbar.children, item => {
    const dataLink = item.getAttribute("data-link");
    item.classList[dataLink === linkId ? "add" : "remove"]("active");
  })
  Array.prototype.forEach.call(container.children, item => {
    const dataLink = item.getAttribute("id");
    console.log(dataLink);
    console.log(linkId);
    item.classList[dataLink === linkId ? "add" : "remove"]("active");
  })
}

Array.prototype.forEach.call(tabbar.children, (item) => item.addEventListener("click", () => {
  const dataLink = item.getAttribute("data-link");
  if (!dataLink || item.classList.contains("active")) return;
  routerGo(dataLink);
}))

routerGo(tabbar.children[0].getAttribute("data-link"))