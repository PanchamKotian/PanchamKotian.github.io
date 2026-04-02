// Function to create a small collision animation
export function createBlast(x, y) {
    const blast = document.createElement('div');
    blast.className = 'blast';
    blast.style.left = x + 'px';
    blast.style.top = y + 'px';
    document.body.appendChild(blast);
    setTimeout(() => blast.remove(), 150);
}
// Function to spawn debris after collision of satellites.
export function spawnDebris(x, y, debrisArray, MAX_DEBRIS, DebrisClass) {
    for (let i = 0; i < 12; i++) {
        if (debrisArray.length > MAX_DEBRIS) break;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3 + 1;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        debrisArray.push(new DebrisClass(x, y, vx, vy));
    }
}
// Object interaction logic handled here-
export function handleCollisions(satellites, debris, MAX_DEBRIS, DebrisClass, createBlastFn, spawnDebrisFn) {
    // Satellite vs Satellite
    for (let i = 0; i < satellites.length; i++) {
        for (let j = i + 1; j < satellites.length; j++) {
            const dist = Math.hypot(satellites[i].x - satellites[j].x, satellites[i].y - satellites[j].y);
            if (dist < (satellites[i].radius + satellites[j].radius)) {
                const midX = (satellites[i].x + satellites[j].x) / 2;
                const midY = (satellites[i].y + satellites[j].y) / 2;
                createBlastFn(midX, midY);
                spawnDebrisFn(midX, midY, debris, MAX_DEBRIS, DebrisClass);
                satellites.splice(j, 1);
                satellites.splice(i, 1);
                i--; break;
            }
        }
    }
    // Satellite vs Debris
    for (let i = 0; i < satellites.length; i++) {
        for (let j = 0; j < debris.length; j++) {
            const dist = Math.hypot(satellites[i].x - debris[j].x, satellites[i].y - debris[j].y);
            if (dist < (satellites[i].radius + debris[j].radius)) {
                const midX = (satellites[i].x + debris[j].x) / 2;
                const midY = (satellites[i].y + debris[j].y) / 2;
                createBlastFn(midX, midY);
                spawnDebrisFn(midX, midY, debris, MAX_DEBRIS, DebrisClass);
                satellites.splice(i, 1);
                debris.splice(j, 1);
                i--; break;
            }
        }
    }
}