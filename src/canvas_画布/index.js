class Paint {
  canvas = null;
  ctx = null;
  isDrawing = false;
  last = null;
  el = null;

  constructor(el = document.body) {
    this.el = el;
    this.canvas = document.createElement("canvas");
    el.appendChild(this.canvas);
    this.init(el);
    this.bindEvent();
  }

  init(el) {
    // 按照设备像素初始化画布，解决高清屏幕下模糊问题
    this.ctx = this.getPixelRatioCtx();
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = "black";
    this.ctx.fillStyle = "black";
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.globalCompositeOperation = "source-over";
    this.isDrawing = false;
    this.last = null;

    //
    this.ctx.font = "20px serif";
    this.ctx.fillText("Hello canvas 画布", 200, 50);
  }
  getPixelRatioCtx = () => {
    const dpr = window.devicePixelRatio;
    const ctx = this.canvas.getContext("2d");
    this.width = this.el.clientWidth;
    this.height = this.el.clientHeight;
    this.canvas.style.position = "absolute";
    this.canvas.style.top = 0;
    this.canvas.style.left = 0;
    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    ctx.scale(dpr, dpr);
    return ctx;
  };
  bindEvent() {
    this.canvas.addEventListener("mousedown", this.start.bind(this));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("mouseup", this.end.bind(this));
    this.canvas.addEventListener("mouseout", this.end.bind(this));
    window.addEventListener("resize", this.onWindowResize);
  }

  onWindowResize = (e) => {
    this.init(this.el);
  };

  start(e) {
    this.isDrawing = true;
    this.last = [e.offsetX, e.offsetY];
  }

  draw(e) {
    if (!this.isDrawing) return;
    const [x, y] = [e.offsetX, e.offsetY];
    this.ctx.beginPath();
    this.ctx.moveTo(...this.last);
    this.ctx.lineTo(x, y);
    this.ctx.stroke();
    this.last = [x, y];
  }

  end() {
    this.isDrawing = false;
  }
}

new Paint();
