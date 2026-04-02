export function rebuildCommunicationEdges(satellites) {
    if (satellites.length < 2) return [];
    const edges = [];
    for (let i = 0; i < satellites.length; i++) {
        for (let j = i + 1; j < satellites.length; j++) {
            const dist = Math.hypot(satellites[i].x - satellites[j].x, satellites[i].y - satellites[j].y);
            edges.push({ from: satellites[i], to: satellites[j], dist, progress: 0 });
        }
    }
    edges.sort((a, b) => a.dist - b.dist);
    const maxEdges = Math.min(edges.length, Math.floor(satellites.length * 1.5));
    return edges.slice(0, maxEdges);
}
// Issue with below function. This needs to be checked in next iteration
export function drawCommunicationLines(ctx, edges) {
    for (const edge of edges) {
        if (edge.progress < 1) edge.progress += 0.02;
        const dx = (edge.to.x - edge.from.x) * edge.progress;
        const dy = (edge.to.y - edge.from.y) * edge.progress;
        ctx.beginPath();
        ctx.moveTo(edge.from.x, edge.from.y);
        ctx.lineTo(edge.from.x + dx, edge.from.y + dy);
        ctx.strokeStyle = 'rgba(88, 166, 255, 0.5)';
        ctx.lineWidth = 2;
        ctx.setLineDash([6, 8]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}