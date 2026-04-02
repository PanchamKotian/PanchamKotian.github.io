export class Star {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.reset();
    }
    reset() {
        this.x = Math.random() * this.width;
        this.y = Math.random() * this.height;
        this.size = Math.random() * 1.5;
        this.alpha = Math.random();
        this.blink = Math.random() * 0.015;
    }
    draw(ctx) {
        this.alpha += this.blink;
        if (this.alpha > 1 || this.alpha < 0.2) this.blink *= -1;
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        ctx.fillRect(this.x, this.y, this.size, this.size);
    }
}