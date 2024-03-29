const progressEl = document.querySelector("#progress");
const valEl = document.querySelector("#val");

class Progress {
  static OTTER_COLOR = "#FCD99B";
  static INNER_COLOR = "#FF6803";
  canvas = null;
  percent = 50;
  ctx = null;
  dpr = 0;
  width = 0;
  height = 0;
  xCenter = 0;
  yCenter = 0;
  radius = 0;
  left = 0;
  top = 0;
  touching = false;
  listeners = [];

  constructor(canvas, percent = 50) {
    this.canvas = canvas;
    this.percent = percent;
    this.init();
    this.initEventListener();
  }
  init = () => {
    this.ctx = this.initRatioCtx(this.canvas);
    this.setProgress(this.percent);
    this.initCanvasPosition();
  };
  initCanvasPosition () {
    const canvasRect = this.canvas.getBoundingClientRect();
    const { left, top } = canvasRect;
    this.left = left;
    this.top = top;
  }
  initRatioCtx (canvas) {
    const canvasRect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio;
    const width = canvasRect.width;
    const height = canvasRect.height;

    canvas.style.width = width;
    canvas.style.height = height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    // 后续操作用的都是不带dpr计算的宽高
    this.dpr = dpr;
    this.width = width;
    this.height = height;

    // 初始化常用变量
    this.xCenter = this.getXByRate(50);
    this.yCenter = this.getYByRate(90);
    this.radius = this.getYByRate(70);

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return ctx;
  }
  clear () {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }
  getXByRate (xPercent) {
    return (this.width * xPercent) / 100;
  }
  getYByRate (yPercent) {
    return (this.height * yPercent) / 100;
  }
  percent2Angle (percent) {
    return Math.PI * (percent / 100 - 1);
  }
  initOuterLine () {
    this.ctx.beginPath();
    this.ctx.arc(
      this.xCenter,
      this.yCenter,
      this.radius,
      this.percent2Angle(0),
      this.percent2Angle(100)
    );
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = Progress.OTTER_COLOR;
    this.ctx.stroke();
  }
  setProgress (percent) {
    this.clear();
    this.initOuterLine();
    percent = Math.abs(percent);
    this.percent = percent;
    // console.log(percent);
    this.onChange(percent);
    this.ctx.beginPath();
    const start = this.percent2Angle(0);
    const end = this.percent2Angle(percent);
    this.ctx.arc(this.xCenter, this.yCenter, this.radius, start, end);
    this.ctx.lineWidth = 7;
    this.ctx.strokeStyle = Progress.INNER_COLOR;
    this.ctx.stroke();
    this.setBarIcon(percent);
  }
  setBarIcon (percent) {
    this.ctx.beginPath();
    percent = percent > 99.5 ? 99.5 : percent;
    const start = this.percent2Angle(percent);
    const end = this.percent2Angle(percent + 0.5);
    this.ctx.arc(this.xCenter, this.yCenter, this.radius, start, end);
    this.ctx.lineWidth = 15;
    this.ctx.strokeStyle = Progress.INNER_COLOR;
    this.ctx.stroke();
  }
  getCurrentBarPosition () {
    const h = this.radius * Math.sin(1.8 * this.percent * Math.PI / 180);
    const s = this.radius * Math.cos(1.8 * this.percent * Math.PI / 180);
    const x = this.xCenter - s;
    const y = this.yCenter - h;
    return { x, y };
  }
  isPositionInProgressBar (x, y) {
    // new
    const { x: cx, y: cy } = this.getCurrentBarPosition();
    return Math.abs(x - cx) < 20 && Math.abs(y - cy) < 20;
  }
  radiansToDegrees (radians) {
    const degrees = radians * (180 / Math.PI);
    return degrees;
  }
  getPercent (x, y) {
    const l1 = this.yCenter - y;
    const l2 = this.xCenter - x;
    const angle = Math.atan2(l1, l2);
    let ans = Math.ceil((this.radiansToDegrees(angle) / 180) * 100);
    if (ans < 0 || ans > 100) {
      ans = this.percent;
    }
    return ans;
  }
  initEventListener () {
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("click", this.onClick);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    document.addEventListener("mouseup", this.onMouseUp); // take care
    this.canvas.addEventListener("mousemove", this.onMouseMove);
    this.canvas.addEventListener("touchstart", this.onTouchStart);
    this.canvas.addEventListener("touchmove", this.onTouchMove);
    this.canvas.addEventListener("touchend", this.onTouchEnd);
    this.canvas.addEventListener("touchcancel", this.onTouchCancel);
  }
  destroyEventListener () {
    window.removeEventListener("resize", this.onResize);
    this.canvas.removeEventListener("click", this.onClick);
    this.canvas.removeEventListener("mousedown", this.onMouseDown);
    document.removeEventListener("mouseup", this.onMouseUp);
    this.canvas.removeEventListener("mousemove", this.onMouseMove);
    this.canvas.removeEventListener("touchstart", this.onTouchStart);
    this.canvas.removeEventListener("touchmove", this.onTouchMove);
    this.canvas.removeEventListener("touchend", this.onTouchEnd);
    this.canvas.removeEventListener("touchcancel", this.onTouchCancel);
  }
  onResize = () => {
    this.clear();
    this.destroyEventListener();
    this.init();
    this.initEventListener();
  };
  onClick = (e) => {
    const { x, y } = e;
    const relativeX = x - this.left;
    const relativeY = y - this.top;
    const inProgressBar = this.isPositionInProgressBar(relativeX, relativeY);
    if (inProgressBar) {
      const percent = this.getPercent(relativeX, relativeY);
      this.setProgress(percent);
    }
  };
  onMouseDown = (e) => {
    const { x, y } = e;
    const relativeX = x - this.left;
    const relativeY = y - this.top;
    if (this.isPositionInProgressBar(relativeX, relativeY)) {
      this.touching = true;
    }
  };
  onMouseUp = () => {
    this.touching = false;
  };
  onMouseMove = (e) => {
    if (!this.touching) {
      return;
    }
    const { x, y } = e;
    const relativeX = x - this.left;
    const relativeY = y - this.top;
    const percent = this.getPercent(relativeX, relativeY);
    this.setProgress(percent);
  };
  onTouchMove = (e) => {
    if (!this.touching) {
      return;
    }
    e.preventDefault();
    const { pageX: x, pageY: y } = e.targetTouches[0];
    const relativeX = x - this.left;
    const relativeY = y - this.top;
    const percent = this.getPercent(relativeX, relativeY);
    this.setProgress(percent);
  };
  onTouchStart = (e) => {
    const { pageX: x, pageY: y } = e.targetTouches[0];
    const relativeX = x - this.left;
    const relativeY = y - this.top;
    if (this.isPositionInProgressBar(relativeX, relativeY)) {
      this.touching = true;
    }
  };
  onTouchEnd = () => {
    this.touching = false;
  };
  onTouchCancel = () => {
    this.touching = false;
  };
  addListener = (fn) => {
    if (typeof fn === "function") {
      this.listeners.push(fn);
    }
  };
  onThrottleChange = () => {
    const TIME = 20;
    let timer = null;
    const onChange = (val) => {
      if (timer !== null) {
        return;
      }
      timer = setTimeout(() => {
        this.listeners.forEach((fn) => fn(val));
        timer = null;
      }, TIME);
    };
    return onChange;
  };
  onChange = this.onThrottleChange();
  setValue (value) {
    this.setProgress(value);
  }
}

const progress = new Progress(progressEl, 20);
const onChange = (val) => valEl.innerText = val;

progress.addListener(onChange);
