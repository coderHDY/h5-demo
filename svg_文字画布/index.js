class SVGDrawer {
  constructor(container) {
    this.container = container;
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.container.appendChild(this.svg);
    this.textGroup = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "g"
    );
    this.svg.appendChild(this.textGroup);

    this.textData = [];
    this.scale = 1;
    this.translateX = 0;
    this.translateY = 0;
    this.isDragging = false;
    this.lastX = 0;
    this.lastY = 0;
    this.minScale = 0.5;
    this.maxScale = 5;

    this.setupSVG();
    this.addEventListeners();
  }

  setupSVG() {
    this.svg.setAttribute("width", "100%");
    this.svg.setAttribute("height", "100%");
    this.updateTransform();
  }

  setTextData(data) {
    this.textData = data;
  }

  draw() {
    while (this.textGroup.firstChild) {
      this.textGroup.removeChild(this.textGroup.firstChild);
    }

    this.textData.forEach((item) => {
      const text = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "text"
      );
      text.setAttribute("x", item.x);
      text.setAttribute("y", item.y);
      text.setAttribute("dominant-baseline", "hanging");
      text.setAttribute("font-size", item.size);
      text.textContent = item.text;
      this.textGroup.appendChild(text);

      const bbox = text.getBBox();
      console.log(bbox);
      const centerX = bbox.x + bbox.width / 2;
      const centerY = bbox.y + bbox.height / 2;

      text.setAttribute(
        "transform",
        ` translate(${-bbox.width / 2}, ${-bbox.height / 2}) rotate(${
          item.rotate
        }, ${centerX}, ${centerY})`
      );
    });
  }

  updateTransform() {
    this.textGroup.setAttribute(
      "transform",
      `translate(${this.translateX},${this.translateY}) scale(${this.scale})`
    );
  }

  addEventListeners() {
    this.svg.addEventListener("mousedown", this.startDrag.bind(this));
    this.svg.addEventListener("mousemove", this.drag.bind(this));
    this.svg.addEventListener("mouseup", this.endDrag.bind(this));
    this.svg.addEventListener("mouseleave", this.endDrag.bind(this));
    this.svg.addEventListener("wheel", this.handleWheel.bind(this));
    this.svg.addEventListener("touchstart", this.handleTouchStart.bind(this));
    this.svg.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.svg.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  startDrag(e) {
    this.isDragging = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  drag(e) {
    if (!this.isDragging) return;
    const dx = e.clientX - this.lastX;
    const dy = e.clientY - this.lastY;
    this.translateX += dx;
    this.translateY += dy;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.updateTransform();
  }

  endDrag() {
    this.isDragging = false;
  }

  handleWheel(e) {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.95 : 1.07;
    this.zoom(delta, e.clientX, e.clientY);
  }

  handleTouchStart(e) {
    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      this.lastTouchDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      this.lastTouchX = (touch1.clientX + touch2.clientX) / 2;
      this.lastTouchY = (touch1.clientY + touch2.clientY) / 2;
    } else if (e.touches.length === 1) {
      this.startDrag(e.touches[0]);
    }
  }

  handleTouchMove(e) {
    e.preventDefault();

    if (e.touches.length === 2) {
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const currentDistance = Math.hypot(
        touch1.clientX - touch2.clientX,
        touch1.clientY - touch2.clientY
      );
      const currentX = (touch1.clientX + touch2.clientX) / 2;
      const currentY = (touch1.clientY + touch2.clientY) / 2;

      // 处理缩放
      const scaleDelta = currentDistance / this.lastTouchDistance;
      this.zoom(scaleDelta, currentX, currentY);

      // 处理平移
      const dx = currentX - this.lastTouchX;
      const dy = currentY - this.lastTouchY;
      this.translateX += dx;
      this.translateY += dy;

      this.lastTouchDistance = currentDistance;
      this.lastTouchX = currentX;
      this.lastTouchY = currentY;

      this.updateTransform();
    } else if (e.touches.length === 1) {
      this.drag(e.touches[0]);
    }
  }

  handleTouchEnd() {
    this.endDrag();
    this.lastTouchDistance = 0;
    this.lastTouchX = 0;
    this.lastTouchY = 0;
  }

  zoom(delta, x, y) {
    const newScale = this.scale * delta;
    if (newScale < this.minScale || newScale > this.maxScale) return;

    const rect = this.svg.getBoundingClientRect();
    const svgX = x - rect.left;
    const svgY = y - rect.top;

    this.translateX = svgX - (svgX - this.translateX) * delta;
    this.translateY = svgY - (svgY - this.translateY) * delta;
    this.scale = newScale;

    this.updateTransform();
  }
}

// 使用示例
const container = document.getElementById("svg-container");
const drawer = new SVGDrawer(container);

const textData = [
  { text: "双击添加文字", x: 200, y: 200, size: 20, rotate: 0 },
  { text: "Hello", x: 230, y: 500, size: 20, rotate: 45 },
  { text: "World", x: 400, y: 340, size: 20, rotate: 90 },
];

drawer.setTextData(textData);
drawer.draw();

const appendText = ({ text = "Text", x = 0, y = 0, size = 20, rotate = 0 }) => {
  x = (x - drawer.translateX) / drawer.scale;
  y = (y - drawer.translateY) / drawer.scale;
  textData.push({ text, x, y, size, rotate });
  drawer.setTextData(textData);
  drawer.draw();
};

// 双击屏幕追加文字
container.addEventListener("dblclick", (e) => {
  console.log(e);
  const x = e.clientX;
  const y = e.clientY;
  // const size = Math.floor(Math.random() * 30) + 10;
  const size = 20;
  const rotate = Math.floor(Math.random() * 360);
  const text = prompt(`${x}, ${y}`, "Text");
  if (text) {
    appendText({ text, x, y, size, rotate });
  }
});
