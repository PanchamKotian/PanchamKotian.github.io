export class Debris {
    constructor(x, y, vx, vy) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.size = Math.random() * 3 + 2;
        this.radius = this.size;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
    }
    draw(ctx) {
        ctx.fillStyle = '#aaaaaa';
        ctx.fillRect(this.x - this.size/2, this.y - this.size/2, this.size, this.size);
    }
    isOnScreen(width, height) {
        return this.x > -50 && this.x < width + 50 && this.y > -50 && this.y < height + 50;
    }
}