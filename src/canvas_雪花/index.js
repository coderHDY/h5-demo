class SnowController {
    canvas = document.querySelector("#snowCanvas");
    ctx = this.canvas.getContext("2d");
    width = window.innerWidth;
    height = window.innerHeight;
    snowQueue = [];
    time = 0; // 开始访问的毫秒数
    constructor() {
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.loop();
        window.addEventListener("resize", this.resize)
    }
    loop = (time = 0) => {
        let diffTime = time - this.time;
        if (diffTime > 20) {
            this.time = time
            this.snowQueue.push(new SnowItem(this.ctx));
        }
        // 30帧～60帧
        // 1000 / 30 = 33ms/fs
        // 1000 / 60 = 17ms/fs
        diffTime = diffTime < 17 ? 17 : (diffTime > 33 ? 33 : diffTime);


        this.ctx.clearRect(0, 0, this.width, this.height);
        this.drawSnow(diffTime);
        requestAnimationFrame(this.loop);
    }
    drawSnow(diffTime) {
        for (let i = this.snowQueue.length - 1; i > 0; i--) {
            const item = this.snowQueue[i];
            item.draw(diffTime, this.width, this.height);
            if (item.done) this.snowQueue.splice(i, 1);
        }
    }

    resize = () => {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

class SnowItem {
    ctx;
    R = Math.random() * 6;
    x = (Math.random() - 0.5) * window.innerWidth * 2;
    y = 0;
    speed = Math.random();
    done = false;
    constructor(ctx) {
        this.ctx = ctx;
    }
    draw(diffTime, maxX, maxY) {
        this.x += diffTime / 70 + (this.speed - 0.5) * 0.5;
        this.y += diffTime / 70 + this.speed * 0.3;
        if (this.y > maxY) this.done = true;
        this.ctx.beginPath();
        this.ctx.shadowBlur = this.R * 1.5;
        this.ctx.shadowColor = "#ffffff";
        this.ctx.fillStyle = "#ffffff";
        this.ctx.arc(this.x, this.y, this.R, 0, Math.PI * 2);
        this.ctx.fill();
    }
}

new SnowController();