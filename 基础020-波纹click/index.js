const btn = document.querySelector(".btn");
const effect = document.querySelector(".effect");

const generateEffect = (x, y) => {
    const { left, top } = btn.getBoundingClientRect();
    const span = document.createElement("span");
    span.classList.add("effect");
    span.setAttribute("style", `
        left: ${x - left}px;
        top: ${y - top}px;
    `)
    btn.appendChild(span);
    setTimeout(() => btn.removeChild(span), 1000);
}

btn.addEventListener("click", e => {
    generateEffect(e.x, e.y);
})