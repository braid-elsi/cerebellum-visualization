export function getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function getYPositionAbs(yRel, layer) {
    let bounds = layer.getBounds();
    return bounds.y1 + yRel * (bounds.y2 - bounds.y1);
}

export function drawLabel(p5, label, layer) {
    if (!label) {
        return;
    }
    p5.fill(0);
    p5.strokeWeight(0);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(14);
    // p5.textStyle(p5.BOLD);
    p5.textFont("Montserrat");
    p5.rectMode(p5.CENTER);

    let y = getYPositionAbs(label.y, layer);
    p5.text(label.text, label.x, y, label.width);
}
