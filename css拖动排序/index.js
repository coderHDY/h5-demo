const dragWrapper = document.querySelector(".drag-wrapper");
const dragItems = [...(document.querySelectorAll(".drag-item") || [])];

dragItems.forEach(item => {
  item.addEventListener("dragstart", (e) => {
    e.target.classList.add("dragging");
  })
  item.addEventListener("dragend", (e) => {
    e.target.classList.remove("dragging");
  })
  item.addEventListener("dragenter", (e) => {
    e.preventDefault();
  })
})

dragWrapper.addEventListener("dragover", e => {
  e.preventDefault();
  const draggingItem = document.querySelector(".dragging");
  const notDraggingItems = [...(document.querySelectorAll(".drag-item:not(.dragging)") || [])];
  const nextPositionItem = notDraggingItems.find(item => {
    return e.clientY <= item.offsetTop + item.offsetHeight / 2;
  })
  dragWrapper.insertBefore(draggingItem, nextPositionItem);
})
dragWrapper.addEventListener("dragenter", e => e.preventDefault());