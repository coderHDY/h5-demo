const progressEl = document.querySelector("#progress");

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
    return this.width * xPercent / 100;
  }
  getYByRate (yPercent) {
    return this.height * yPercent / 100;
  }
  percent2Angle (percent) {
    return Math.PI * (percent / 100 - 1);
  }
  initOuterLine () {
    this.ctx.beginPath();
    this.ctx.arc(this.xCenter, this.yCenter, this.radius, this.percent2Angle(0), this.percent2Angle(100));
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
    this.ctx.lineWidth = 5;
    this.ctx.strokeStyle = Progress.INNER_COLOR;
    this.ctx.stroke();
    this.setBarIcon(percent)
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
  getYByX (x) {
    const l1 = this.xCenter - x;
    const l3 = this.radius;
    const l2 = Math.sqrt(Math.pow(l3, 2) - Math.pow(l1, 2), 2);

    // 圆弧外为 NaN
    return this.yCenter - l2;
  }
  isPositionInProgressBar (x, y) {
    const yInAngle = this.getYByX(x);
    return yInAngle !== NaN && Math.abs(y - yInAngle) < 20;
  }
  radiansToDegrees (radians) {
    const degrees = radians * (180 / Math.PI);
    return degrees;
  }
  getPercent (x, y) {
    const l1 = this.yCenter - y;
    const l2 = this.xCenter - x;
    const angle = Math.atan2(l1, l2);
    let ans = Math.ceil(this.radiansToDegrees(angle) / 180 * 100);
    if (ans < 0 || ans > 100) {
      ans = this.percent;
    }
    return ans;
  }
  initEventListener () {
    window.addEventListener("resize", this.onResize);
    this.canvas.addEventListener("click", this.onClick);
    this.canvas.addEventListener("mousedown", this.onMouseDown);
    this.canvas.addEventListener("mouseup", this.onMouseUp);
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
    this.canvas.removeEventListener("mouseup", this.onMouseUp);
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
  }
  onClick = (e) => {
    const { x, y } = e;
    const inProgressBar = this.isPositionInProgressBar(x, y);
    if (inProgressBar) {
      const percent = this.getPercent(x, y);
      this.setProgress(percent);
    }
  }
  onMouseDown = (e) => {
    const { x, y } = e;
    if (this.isPositionInProgressBar(x, y)) {
      this.touching = true;
    }
  }
  onMouseUp = (e) => {
    this.touching = false;
  }
  onMouseMove = (e) => {
    if (!this.touching) {
      return;
    }
    const { x, y } = e;
    const percent = this.getPercent(x, y);
    this.setProgress(percent);
  }
  onTouchMove = (e) => {
    if (!this.touching) {
      return;
    }
    const { pageX: x, pageY: y } = e.targetTouches[0];
    const percent = this.getPercent(x, y);
    this.setProgress(percent);
  }
  onTouchStart = (e) => {
    const { pageX: x, pageY: y } = e.targetTouches[0];
    if (this.isPositionInProgressBar(x, y)) {
      this.touching = true;
    }
  }
  onTouchEnd = (e) => {
    this.touching = false;
  }
  onTouchCancel = (e) => {
    this.touching = false;
  }
  addListener = (fn) => {
    if (typeof fn === "function") {
      this.listeners.push(fn);
    }
  }
  onThrottleChange = () => {
    const TIME = 100;
    let timer = null;
    const onChange = (val) => {
      if (timer !== null) {
        return;
      }
      timer = setTimeout(() => {
        this.listeners.forEach(fn => fn(val));
        timer = null;
      }, TIME);
    }
    return onChange;
  }
  onChange = this.onThrottleChange();
}

const progress = new Progress(progressEl, 20);
const onChange = (val) => console.log(val);

progress.addListener(onChange);