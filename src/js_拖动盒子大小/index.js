const resizeHandle = document.querySelector(".resizeHandle");
const topLeft = document.querySelector(".topLeft");
const bottomLeft = document.querySelector(".bottomLeft");
const gantt = document.querySelector(".gantt");

let isResizing = false;

const startResize = (event) => {
  isResizing = true;
  const startScrollLeft = gantt.scrollLeft;

  const handleMouseMove = (event) => {
    if (isResizing) {
      const containerRect = gantt.getBoundingClientRect();
      const newWidth = event.clientX + startScrollLeft - containerRect.left;

      // if (newWidth < 120 || newWidth > 250) return;
      topLeft.style.width = `${newWidth}px`;
    bottomLeft.style.width = `${newWidth}px`;
    }
  };

  const stopResize = () => {
    isResizing = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", stopResize);
    document.removeEventListener("touchend", stopResize);
  };

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseup", stopResize);
  document.addEventListener("touchend", stopResize);
  document.addEventListener("touchmove", (event) => {
    // 阻止触摸事件的默认行为，避免浏览器滚动
    event.preventDefault();
    handleMouseMove(event.touches[0]);
  });
};

resizeHandle.addEventListener("mousedown", startResize);
resizeHandle.addEventListener("touchstart", (event) => {
  startResize(event.touches[0]);
});
