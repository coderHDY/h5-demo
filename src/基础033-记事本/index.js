const addBtn = document.querySelector(".add-btn");
const NOTE = "note";

const getStorageNote = () => JSON.parse(localStorage.getItem(NOTE) ?? "[]");
const setStorageNote = (note) => localStorage.setItem(NOTE, JSON.stringify(note));

const saveStorageNote = (idx, val) => {
    const note = getStorageNote();
    note[idx] = val;
    setStorageNote(note);
}
const addStorageNote = () => {
    const note = getStorageNote();
    note.push([]);
    setStorageNote(note);
}
const delStorageNote = (idx) => {
    const note = getStorageNote();
    note.splice(idx, 1);
    setStorageNote(note);
}
const init = () => getStorageNote().forEach(item => appendNote(item));
const appendNote = (val = "") => {
    const idx = document.querySelectorAll(".note").length;
    const note = document.createElement("div");
    const controller = document.createElement("div");
    const write = document.createElement("button");
    const del = document.createElement("button");
    const writeI = document.createElement("i");
    const delI = document.createElement("i");
    const inner = document.createElement("div");
    const textShow = document.createElement("p");
    const noteCtx = document.createElement("textarea");
    noteCtx.value = val;
    textShow.innerText = val;

    write.addEventListener("click", () => textShow.classList.toggle("show"));
    noteCtx.addEventListener("input", e => {
        textShow.innerText = e.target.value;
        saveStorageNote(idx, e.target.value);
    });
    del.addEventListener("click", () => {
        document.body.removeChild(note);
        delStorageNote(idx);
    })

    note.classList.add("note");
    controller.classList.add("controller");
    write.classList.add("write");
    del.classList.add("del");
    inner.classList.add("inner");
    textShow.classList.add("text-show");
    noteCtx.classList.add("note-ctx");
    writeI.classList.add("fas", "fa-file-pen")
    delI.classList.add("fa-solid", "fa-trash-can")
    write.appendChild(writeI);
    del.appendChild(delI);
    controller.prepend(write, del);
    note.prepend(controller, inner);
    inner.prepend(textShow, noteCtx);
    document.body.appendChild(note);
}
init();
addBtn.addEventListener("click", () => {
    addStorageNote();
    appendNote()
});