const picture = document.querySelector(".picture");
const boxes = document.querySelectorAll(".empty");

Array.prototype.forEach.call(boxes, box => {
    box.addEventListener("dragenter", dragEnter);
    box.addEventListener("dragover", dragOver);
    box.addEventListener("dragleave", dragLeave);
    box.addEventListener("drop", drop);
});

picture.addEventListener("dragstart", dragStart)
picture.addEventListener("dragend", dragEnd)

function dragStart() {
    // 元素的eventListener，拿到的this就是元素本身
    this.classList.add("hold");
}
function dragEnd() {
    this.classList.remove("hold");
}
function dragEnter() {
    this.classList.add("hover");
}
function dragOver(e) {
    /**
     * 重点：浏览器默认阻止编辑模式，不让drop事件发生
     * drop默认效果是让这个drag事件变为none
     * 所以需要在 【dragover】事件中preventDefault
     * 才可以让元素触发drop事件
     *  */

    e.preventDefault()
}
function dragLeave() {
    this.classList.remove("hover");
}
function drop() {
    this.append(picture);
    this.classList.remove("hover");
}