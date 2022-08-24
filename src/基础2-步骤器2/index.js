const progress = document.querySelector(".progress")
const progressItems = progress.querySelectorAll(".progress-item");
const progressActiveLine = document.querySelector(".progress-active-line");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const useProgress = ((totle) => {
    let state = new Proxy({ val: 1 }, {
        set(target, p, v) {
            if (v >= totle) {
                v = totle;
                next.classList.add("disabled");
            } else {
                next.classList.remove("disabled");
            }
            if (v <= 1) {
                v = 1;
                prev.classList.add("disabled");
            } else {
                prev.classList.remove("disabled");
            }
            const persent = (v - 1) / (totle - 1) * 100;
            progressActiveLine.setAttribute("style", `width: ${persent}%`);
            progressItems.forEach((item, idx) => idx < v ? item.classList.add("active") : item.classList.remove("active"));
            Reflect.set(target, p, v);
        }
    })
    return {
        setP: (v) => state.val = v,
        prev: () => state.val--,
        next: () => state.val++,
    }
})(progressItems.length)

progress.addEventListener('click', (e) => {
    const v = e.target.getAttribute("data-progress");
    if (!v) return;
    useProgress.setP(v);
})
prev.addEventListener("click", useProgress.prev)
next.addEventListener("click", useProgress.next)