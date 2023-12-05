const canvas = document.querySelector("#canvasFish");

class Pool {
  static MAX_FISH_NUM = 5;
  static POINT_INTERVAL = 5;
  static TIME_UNIT = 8;
  static COLOR = "hsl(0, 0%, 9%)";
  canvas = null;
  ctx = null;
  width = 0;
  height = 0;
  poolHeight = 0;

  // 上一个时间戳，所有动画 8ms 为一个单位
  lastStamp = 0;

  points = [];
  fishes = [];

  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = this.getCtx(canvas);
    this.setup();
    this.render(0);
    this.eventListener();
  }

  getCtx = (canvas) => {
    const canvasRect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio;
    const width = canvasRect.width;
    const height = canvasRect.height;
    const poolHeight = canvasRect.height / 2;
    this.width = width;
    this.height = height;
    this.poolHeight = poolHeight;
    Pool.MAX_FISH_NUM = Math.floor(width / 300);

    canvas.style.width = width;
    canvas.style.height = height;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    return ctx;
  };
  setup() {
    this.initFishes();
    this.initSurface();
  }
  eventListener() {
    window.addEventListener("resize", this.onResize);
  }
  onResize = () => {
    console.log("resize");
    this.ctx = this.getCtx(this.canvas);
    this.initSurface();
    this.fishes.forEach((f) => f.initStates());
  };
  initSurface() {
    const firstP = new Surface(0, this.poolHeight);
    this.points.push(firstP);

    const pointNum = Math.floor(this.width / Pool.POINT_INTERVAL);
    for (let i = 1; i <= pointNum; i++) {
      const currentX = Pool.POINT_INTERVAL * i;
      this.points.push(new Surface(currentX, this.poolHeight));
    }
    const lastP = new Surface(this.width, this.poolHeight);
    this.points.push(lastP);
  }
  initFishes() {
    for (let i = 0; i < Pool.MAX_FISH_NUM; i++) {
      setTimeout(() => {
        this.fishes.push(new Fish(this));
      }, i * 1000);
    }
  }
  renderSurface() {
    this.ctx.beginPath();
    this.ctx.moveTo(0, this.height);
    this.points.forEach((p) => p.render(this.ctx));
    this.ctx.lineTo(this.width, this.height);
    this.ctx.closePath();
    this.ctx.fillStyle = Pool.COLOR;
    this.ctx.fill();
  }
  renderFishes(factor) {
    this.fishes.forEach((fish) => fish.render(this.ctx, factor));
  }
  render = (timeStamp) => {
    this.ctx.clearRect(0, 0, this.width, this.height);
    requestAnimationFrame(this.render);

    // 根据时间戳计算倍数
    let factor = 1;
    if (timeStamp !== 0) {
      factor = (timeStamp - this.lastStamp) / Pool.TIME_UNIT;
      this.lastStamp = timeStamp;
    }
    this.ctx.save();
    this.renderFishes(factor);
    this.ctx.globalCompositeOperation = "xor";
    this.renderSurface();
    this.ctx.restore();
  };
}

class Surface {
  x = 0;
  y = 0;
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  render(ctx) {
    ctx.lineTo(this.x, this.y);
  }
}

class Fish {
  static HEIGHT = 90;
  static WIDTH = 125;
  static FIN_ROTATE_MIN = -10;
  static FIN_ROTATE_MAX = 8;
  pool = null;
  x = 0;
  y = 0;
  vx = 0;
  vy = 0;
  poolHeight = 0;
  poolWidth = 0;

  // y轴加速度
  ay = 0;

  // 是否离开水面
  isOut = false;

  // 鱼鳍角度
  // max: 8 min: -10
  finsRotate = this.randomRange(-10, 8);
  isFinsRotateUp = this.randomBool();

  // 正方向
  direction = this.randomBool();
  constructor(pool) {
    this.pool = pool;
    this.initStates();
  }
  initStates() {
    this.poolHeight = this.pool.poolHeight;
    this.poolWidth = this.pool.width;
    this.x = this.direction ? 0 : this.poolWidth;
    // 水面和水下同样高度
    // this.y = this.randomRange(
    //   this.poolHeight,
    //   this.poolHeight * 2 - Fish.HEIGHT
    // );
    this.y = this.poolHeight;

    // tip: 速度应该用 requestAnimationFrame 时间计算不会掉帧
    this.vx = this.randomRange(3, 7) * (this.direction ? 1 : -1);

    // 最大速度，要不要计算正负？
    this.vy = this.randomRange(1, 2);
  }
  randomRange(min, max) {
    return min + (max - min) * Math.random();
  }
  randomBool() {
    return Math.random() < 0.5;
  }
  updateIsOut() {
    this.isOut = this.y < this.poolHeight - Fish.HEIGHT;
  }
  updateFinRotate() {
    // 出水面不动鱼鳍角度
    if (this.isOut) {
      return;
    }
    if (this.isFinsRotateUp) {
      this.finsRotate += 0.6;
    } else {
      this.finsRotate -= 0.6;
    }

    if (this.finsRotate >= Fish.FIN_ROTATE_MAX) {
      this.isFinsRotateUp = false;
    } else if (this.finsRotate <= Fish.FIN_ROTATE_MIN) {
      this.isFinsRotateUp = true;
    }
  }
  updateVy() {
    if (this.isOut) {
      this.vy += 0.1;
    } else {
      this.vy -= 0.1;
    }
  }
  controlStates(factor) {
    this.x += this.vx * factor;
    this.y += this.vy * factor;
    this.updateFinRotate();
    this.updateIsOut();
    this.updateVy();
    if (this.x < -Fish.WIDTH || this.x > this.poolWidth + Fish.WIDTH) {
      this.reverse();
    }
  }
  // 到达终点重新放一条鱼
  reverse() {
    this.direction = this.randomBool();
    this.initStates();
  }

  // todo: window.resize Pool调用
  rerender() {}
  getBodyRotate() {
    return Math.atan2(this.vy, this.vx * (this.direction ? 1 : -1));
  }
  render(ctx, factor) {
    ctx.save();
    ctx.beginPath();

    // ???
    ctx.translate(this.x, this.y);

    // 根据方向 direction 左右旋转画笔
    ctx.scale(this.direction ? 1 : -1, 1);
    /* 
      画笔旋转角度，来让鱼旋转
      应该用 vx 和 vy 来计算正确的角度
     */
    // 整体鱼的朝向
    const bodyRotate = this.getBodyRotate();
    // console.log(bodyRotate);
    ctx.rotate(bodyRotate);

    ctx.save();
    ctx.scale(0.8, 0.8);
    // 鱼身
    ctx.moveTo(0, 45);
    ctx.bezierCurveTo(-10, 75, -70, 65, -100, 45);
    ctx.moveTo(0, 45);
    ctx.bezierCurveTo(-10, 15, -70, 25, -100, 45);

    // 鱼鳍1，需旋转所以save/restore
    ctx.save();
    // max: 8 min: -10
    ctx.moveTo(-30, 35);
    ctx.rotate((this.finsRotate * Math.PI) / 180);
    ctx.quadraticCurveTo(-25, 10, -70, 5);
    ctx.quadraticCurveTo(-45, 25, -50, 35);
    ctx.restore();

    // 鱼鳍2，需旋转所以save/restore
    ctx.save();
    ctx.moveTo(-30, 55);
    ctx.rotate((-this.finsRotate * Math.PI) / 180);
    ctx.quadraticCurveTo(-25, 75, -70, 90);
    ctx.quadraticCurveTo(-45, 45, -50, 55);
    ctx.restore();

    // 鱼尾
    ctx.moveTo(-90, 45);
    ctx.bezierCurveTo(-105, 30, -140, 25, -110, 45);
    ctx.moveTo(-90, 45);
    ctx.bezierCurveTo(-105, 60, -140, 65, -110, 45);
    ctx.restore();

    ctx.fill();
    ctx.restore();
    this.controlStates(factor);
  }
}

new Pool(canvas);
