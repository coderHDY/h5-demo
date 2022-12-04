const goToFullScreen = (element = document.body) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullScreen();
    }
};
document.body.addEventListener("click", () => goToFullScreen());

const randomRgb = () => `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 255)`;
class FireWork {
    static UP = "up";
    static WAIT = "wait";
    static FIRE = "fire";
    static OUT = "out";
    state = FireWork.UP;
    x = 0;
    y = 0;
    r = Math.random() * 100 + 80;
    opacity = Math.random();
    color = randomRgb();
    bgc = () => `${this.color.slice(0, -1)}, ${this.opacity})`;
    lineColor = () => `${this.color.slice(0, -1)}, ${this.opacity * 1.5})`;
    scale = 0;
    speed = 1 / this.r / 1.3;
    finished = false;
    waitTime = Math.random() * 300;
    bordersNum = Math.ceil(Math.random() * 3) + 7;
    currentY = window.innerHeight;
    lineDash = [Math.random() * 10, Math.random() * 100 + 10]
    fly = new Audio();
    boom = new Audio();
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.initAudio()
    }
    initAudio() {
        this.fly.volume = 0.2;
        this.fly.setAttribute("autoplay", true)
        this.fly.src = "./fly1.mp3";
    }
    // 更新及渲染放到自组件来做，父组件控制整体流程
    update(ctx) {
        switch (this.state) {
            case FireWork.UP: {
                this.up(ctx);
                break;
            }
            case FireWork.WAIT: {
                this.wait();
                break;
            }
            case FireWork.FIRE: {
                this.fire(ctx);
                break;
            }
            case FireWork.OUT: {
                this.out(ctx);
                break;
            }
            default: { }
        }
    }
    up(ctx) {
        this.currentY--;
        if (this.currentY >= this.y) {
            ctx.beginPath();
            const gradient = ctx.createLinearGradient(this.x, this.currentY, this.x, this.currentY + 10);
            gradient.addColorStop(0, this.bgc());
            gradient.addColorStop(1, "transparent");
            ctx.fillStyle = gradient;
            ctx.fillRect(this.x, this.currentY, 3, 50);
        } else {
            this.state = FireWork.WAIT;
        }
    }
    wait() {
        this.waitTime--;
        if (this.waitTime <= 0) {
            this.state = FireWork.FIRE;
            this.boom.setAttribute("autoplay", true);
            this.boom.src = "./boom.mp3";
        }
    }
    fire(ctx) {
        this.speed *= 0.999;
        this.scale += this.speed;
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 1.5 * this.scale);
        gradient.addColorStop(0, this.bgc());
        gradient.addColorStop(1, "transparent");
        ctx.fillStyle = gradient;
        ctx.strokeWidth = 0;
        ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        ctx.fill();

        ctx.lineWidth = 2;
        ctx.setLineDash(this.lineDash);
        for (let i = 0; i < this.bordersNum; i++) {
            const scale = (1 - this.scale * i * 0.1) * this.scale;
            const startAngle = Math.random() * Math.PI;
            const endAngle = startAngle + 2 * Math.PI;
            ctx.strokeStyle = i % 4 === 0 ? `${randomRgb().slice(0, -1)}, ${this.opacity * 1.5})` : this.lineColor();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * scale, startAngle, endAngle);
            ctx.stroke();
        }

        if (this.scale >= 1) this.finished = true;
        if (this.scale >= 0.3) this.state = FireWork.OUT;
    }
    out(ctx) {
        this.opacity *= 0.998;
        this.fire(ctx);
    }
}
class FireworkController {
    canvas = document.querySelector("#canvas");
    ctx = this.canvas.getContext("2d");
    offsetX = 0;
    offsetY = 0;
    fireworks = [];
    width = window.innerWidth;
    height = window.innerHeight;
    constructor() {
        this.resize();
        this.initEvents();
        this.loop();
    }
    resize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        const ctxRect = this.canvas.getBoundingClientRect();
        const { x, y } = ctxRect;
        this.offsetX = x;
        this.offsetY = y;
    }
    initEvents = () => {
        window.addEventListener("resize", this.resize);
        // 离开清除烟花
        window.addEventListener("visibilitychange", () => {
            if (document.visibilityState === 'visible') this.fireworks = [];
        })
        document.body.addEventListener("click", (e) => {
            const x = e.x - this.offsetX;
            const y = e.y - this.offsetY;
            this.appendFirework(x, y);
        })
    }
    appendFirework(x, y) {
        const firework = new FireWork(x, y);
        this.fireworks.push(firework);
    }
    loop() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.update();
        requestAnimationFrame(() => this.loop());
    }
    update() {
        for (let i = this.fireworks.length; i > 0; i--) {
            const f = this.fireworks[i - 1];
            f.update(this.ctx)
            if (f.finished) this.fireworks.splice(i - 1, 1);
        }
        this.fireworks.forEach(f => {
        });
    }
    randomFire(times) {
        for (let i = 0; i < times; i++) {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const tiemr = Math.random() * 1000 * (times / 20); // 平均每秒20个
            setTimeout(() => this.appendFirework(x, y), tiemr)
        }
    }
    stileFile(timeout = 200) {
        const loop = () => {
            const x = Math.random() * this.width;
            const y = Math.random() * this.height;
            const tiemr = Math.random() * 1000; // 平均每秒20个
            setTimeout(() => this.appendFirework(x, y), tiemr);
        }
        const interval = setInterval(() => loop(), timeout);
        const stop = () => clearInterval(interval);
        return stop;
    }
}

const fireController = new FireworkController();

// 适应屏幕避免手机卡死
const timer = window.innerWidth > 500 ? 150 : 1000;
const stop = fireController.stileFile(timer);
setTimeout(stop, 10000);
