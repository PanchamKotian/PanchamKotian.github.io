let satelliteImage = null;
export async function loadSatelliteImage() {
    if (satelliteImage) return satelliteImage;
    satelliteImage = new Image();
    // Make sure file is present at assets/satellite.svg
    const response = await fetch('assets/satellite.svg');
    const svgText = await response.text();
    const blob = new Blob([svgText], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    satelliteImage.src = url;
    await new Promise((resolve) => { satelliteImage.onload = resolve; });
    return satelliteImage;
}

export class Satellite {
    constructor(width, height, isNightModeRef) {
        this.width = width;
        this.height = height;
        this.isNightModeRef = isNightModeRef;
        this.init();
        this.trail = [];
        this.maxTrail = 20;
    }
    init() {
        const side = Math.floor(Math.random() * 4);
        if(side === 0) { this.x = -80; this.y = Math.random() * this.height; }
        else if(side === 1) { this.x = this.width + 80; this.y = Math.random() * this.height; }
        else if(side === 2) { this.x = Math.random() * this.width; this.y = -80; }
        else { this.x = Math.random() * this.width; this.y = this.height + 80; }
        this.vx = (Math.random() - 0.5) * (Math.random() * 1.5 + 0.8);
        this.vy = (Math.random() - 0.5) * (Math.random() * 1.5 + 0.8);
        this.angle = Math.random() * Math.PI * 2;
        this.radius = 25;
        this.trail = [];
    }
    update() {
        if (this.isNightModeRef.value) {
            this.trail.unshift({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrail) this.trail.pop();
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < -200 || this.x > this.width + 200 || this.y < -200 || this.y > this.height + 200) this.init();
        } else {
            this.trail.unshift({ x: this.x, y: this.y });
            if (this.trail.length > this.maxTrail) this.trail.pop();
        }
    }
    drawTrail(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const age = i / this.trail.length;
            const alpha = (1 - age) * 0.6;
            ctx.fillStyle = `rgba(88, 166, 255, ${alpha})`;
            ctx.beginPath();
            ctx.arc(point.x, point.y, 2 - age * 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    drawPulse(ctx, time) {
        if (!this.isNightModeRef.value) {
            const radius = 20 + Math.sin(time) * 8;
            const alpha = 0.3 + Math.sin(time * 3) * 0.2;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(88, 166, 255, ${alpha})`;
            ctx.lineWidth = 2;
            ctx.stroke();
            const radius2 = 30 + Math.sin(time + 1) * 10;
            const alpha2 = 0.2 + Math.sin(time * 2) * 0.15;
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(88, 166, 255, ${alpha2})`;
            ctx.stroke();
        }
    }
    draw(ctx, time, image) {
        this.drawTrail(ctx);
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#58a6ff';
        if (image && image.complete) {
            ctx.drawImage(image, -16, -16, 32, 32);
        } else {
            // fallback drawing (same as original)
            const mainColor = this.isNightModeRef.value ? '#8b949e' : '#00599C';
            const wingColor = this.isNightModeRef.value ? '#58a6ff' : '#4a5568';
            ctx.fillStyle = mainColor;
            ctx.fillRect(-8, -8, 16, 16);
            ctx.strokeStyle = mainColor;
            ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, -12, 7, Math.PI, 0); ctx.stroke();
            ctx.fillStyle = wingColor;
            ctx.fillRect(-22, -4, 14, 8);
            ctx.fillRect(8, -4, 14, 8);
        }
        ctx.restore();
        this.drawPulse(ctx, time);
    }
    isOnScreen() {
        return this.x > 0 && this.x < this.width && this.y > 0 && this.y < this.height;
    }
}