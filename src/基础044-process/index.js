const ipt = document.querySelector(".ipt");
const dot = document.querySelector(".dot");
const process = document.querySelector(".process");

const setVal = (val) => {
    val = val < 0 ? 0 : (val > 100 ? 100 : val);
    ipt.value = val;
    dot.style.left = `${val}%`;
}
let dragable = false;

const mouseDown = () => {
    dot.classList.add("dragable");
    document.body.style.cursor = "pointer";
    dragable = true;
}
const mouseUp = () => {
    dot.classList.remove("dragable");
    document.body.style.cursor = "default";
    dragable = false;
}

function mouseMove(e) {
    if (!dragable) return;
    const { clientWidth, offsetLeft } = process;
    const min = offsetLeft;
    const max = min + clientWidth;
    const left = e.x < min ? 0 : (e.x > max ? 100 : (e.x - min) / (max - min) * 100);
    setVal(parseInt(left));
}


dot.addEventListener("mousedown", mouseDown);
window.addEventListener("mousemove", mouseMove);
window.addEventListener("mouseup", mouseUp);
ipt.addEventListener("input", e => setVal(+e.target.value));

setVal(0);