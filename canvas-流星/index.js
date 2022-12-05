const canvas = document.querySelector("#canvas");

class Star {
    static DOWN = "down";
    static FLASH_BIGGER = "flashBigger";
    static FLASH_SMALLER = "flashSmaller";
    static FINISH = "finish";
    state = Star.DOWN;
    endX = Math.random() * window.innerWidth;
    endY = Math.random() * window.innerHeight;
    startX = this.endX * Math.random() - 100;
    startY = this.endY * Math.random() - 100;
    bgc = "#fff";
    x = this.startX;
    y = this.startY;
    flashTime = Math.random() * 3000;
    flashSize = Math.random() * 10;
    flashSpeed = this.flashSize * 35 / this.flashTime;
    CFlashSize = 1;
    shadowBlur = Math.random() * 10;
    update(ctx) {
        switch (this.state) {
            case Star.DOWN: {
                this.down(ctx);
                break;
            }
            case Star.FLASH_BIGGER: {
                this.flashBigger(ctx);
                break;
            }
            case Star.FLASH_SMALLER: {
                this.flashSmaller(ctx);
                break;
            }
            default: { }
        }
    }
    down(ctx) {
        this.x += 0.5;
        this.y += 0.5;
        ctx.beginPath();
        const gradient = ctx.createLinearGradient(this.startX, this.startY, this.endX, this.endY);
        gradient.addColorStop(0, "transparent");
        gradient.addColorStop(1, this.bgc);
        ctx.strokeStyle = gradient;
        ctx.strokeWidth = 10;
        ctx.shadowBlur = 0;
        ctx.moveTo(this.startX, this.startY);
        ctx.lineTo(this.x, this.y);
        ctx.stroke();
        if (this.x >= this.endX || this.y >= this.endY) this.state = Star.FLASH_BIGGER
    }
    flashBigger(ctx) {
        this.flashTime--;
        this.CFlashSize += this.flashSpeed;
        ctx.beginPath();
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowColor = "#fff";
        ctx.strokeStyle = this.bgc;
        ctx.moveTo(this.x - this.CFlashSize, this.y - this.CFlashSize);
        ctx.lineTo(this.x + this.CFlashSize, this.y + this.CFlashSize);
        ctx.moveTo(this.x - this.CFlashSize, this.y + this.CFlashSize);
        ctx.lineTo(this.x + this.CFlashSize, this.y - this.CFlashSize);
        ctx.stroke();
        if (this.CFlashSize >= this.flashSize) this.state = Star.FLASH_SMALLER;
    }
    flashSmaller(ctx) {
        this.flashTime--;
        this.CFlashSize -= this.flashSpeed;
        ctx.beginPath();
        ctx.shadowBlur = this.shadowBlur;
        ctx.shadowColor = "#fff";
        ctx.strokeStyle = this.bgc;
        ctx.moveTo(this.x - this.CFlashSize, this.y - this.CFlashSize);
        ctx.lineTo(this.x + this.CFlashSize, this.y + this.CFlashSize);
        ctx.moveTo(this.x - this.CFlashSize, this.y + this.CFlashSize);
        ctx.lineTo(this.x + this.CFlashSize, this.y - this.CFlashSize);
        ctx.stroke();
        if (this.CFlashSize <= 1) this.state = Star.FINISH;

    }
}

class StarController {
    canvas = null;
    ctx = null;
    starList = [];

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        this.initSize();
        this.loop();
    }
    initSize() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const dpr = window.devicePixelRatio;
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        this.canvas.style.width = width;
        this.canvas.style.height = height;
    }
    appendStar() {
        const star = new Star();
        this.starList.push(star);
    }

    update() {
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = this.starList.length - 1; i >= 0; i--) {
            if (this.starList[i].state === Star.FINISH) {
                this.starList.splice(i, 1);
            } else {
                this.starList[i].update(this.ctx);
            }
        }
    }
    // return stop()
    begin(timer) {
        const interval = setInterval(() => this.appendStar(), timer);
        const stop = () => clearInterval(interval);
        return stop;
    }
    loop() {
        this.update();
        requestAnimationFrame(() => this.loop())
    }
}

const starController = new StarController(canvas);
const stop = starController.begin(100);
// setTimeout(() => stop(), 10000);


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