import { Star } from './starfield.js';
import { Satellite, loadSatelliteImage } from './satellite.js';
import { Debris } from './debris.js';
import { createBlast, spawnDebris, handleCollisions } from './collision.js';
import { rebuildCommunicationEdges, drawCommunicationLines } from './Dijkstra.js';
import { initTheme } from './theme.js';

const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let stars = [];
let satellites = [];
let debris = [];
let communicationEdges = [];
const MAX_DEBRIS = 300;
const SATELLITE_COUNT = 12;

const isNightMode = initTheme();
// Watch for theme changes to rebuild communication lines
let previousMode = isNightMode.value;
setInterval(() => {
    if (isNightMode.value !== previousMode) {
        previousMode = isNightMode.value;
        if (!isNightMode.value) {
            communicationEdges = rebuildCommunicationEdges(satellites);
        } else {
            communicationEdges = [];
        }
    }
}, 100);
let satelliteImage = null;

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    stars = Array.from({ length: 100 }, () => new Star(width, height));
    if (satellites.length === 0) {
        satellites = Array.from({ length: SATELLITE_COUNT }, () => new Satellite(width, height, isNightMode));
    } else {
        satellites.forEach(s => { s.width = width; s.height = height; });
    }
}

function animate(time) {
    ctx.clearRect(0, 0, width, height);

    // Draw stars only at night
    if (isNightMode.value) stars.forEach(s => s.draw(ctx));

    // Update and draw debris
    for (let i = debris.length - 1; i >= 0; i--) {
        debris[i].update();
        if (!debris[i].isOnScreen(width, height)) {
            debris.splice(i, 1);
        } else {
            debris[i].draw(ctx);
        }
    }

    // Update satellites
    satellites.forEach(s => s.update());

    // Draw communication lines (day mode)
    if (!isNightMode.value) {
        drawCommunicationLines(ctx, communicationEdges);
    }

    // Draw satellites
    const now = Date.now() / 1000;
    satellites.forEach(s => s.draw(ctx, now, satelliteImage));

    // Collision handling (will modify satellites and debris)
    handleCollisions(
        satellites, debris, MAX_DEBRIS, Debris,
        createBlast,
        (x, y, debrisArr, max, DebrisClass) => spawnDebris(x, y, debrisArr, max, DebrisClass)
    );

    // Ensure we always have some satellites on screen
    while (satellites.length < SATELLITE_COUNT) {
        satellites.push(new Satellite(width, height, isNightMode));
    }

    // Rebuild communication lines if in day mode and edges need update
    if (!isNightMode.value && (communicationEdges.length === 0 || satellites.length !== communicationEdges.length * 0.75)) {
        communicationEdges = rebuildCommunicationEdges(satellites);
    }
    requestAnimationFrame(animate);
}

async function init() {
    satelliteImage = await loadSatelliteImage();
    resize();
    window.addEventListener('resize', resize);
    animate(0);
    // Typewriter effect
    const typewriterEl = document.getElementById('typewriter');
    const text = "Engineer of Electronics & Algorithms";
    let i = 0;
    function type() {
        if (i < text.length) {
            typewriterEl.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    type();
}

init();