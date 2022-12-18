for (let i = 0; i < 80; i++) {
    const div = document.createElement("div");
    div.style = `
    --i: ${Math.random() * 7}s;
    top: ${100 + Math.random() * 60}vh;
    left: ${Math.random() * 100}vw;
    transform: scale(${Math.random() * 0.5});
    `;
    div.classList.add("ball");
    document.body.append(div)
}