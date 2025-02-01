export function getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

export function getRandomFloat(min, max) {
    // min and max included
    return Math.random() * (max - min) + min;
}

export function getYPositionAbs(yRel, layer) {
    // console.log(yRel, layer);
    let bounds = layer.getBounds();
    return bounds.top + yRel * (bounds.bottom - bounds.top);
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

export function isPointNearLine(px, py, line, buffer) {
    // extract the properties x and y from point and
    // assign them to new variables px and py (respectively).
    // const { x: px, y: py } = point;

    const { start, end } = line;
    const { x: x1, y: y1 } = start;
    const { x: x2, y: y2 } = end;

    // Compute the length of the line segment squared
    const lineLengthSquared = (x2 - x1) ** 2 + (y2 - y1) ** 2;

    // If the line is a single point
    if (lineLengthSquared === 0) {
        const distanceToStart = Math.sqrt((px - x1) ** 2 + (py - y1) ** 2);
        return distanceToStart <= buffer;
    }

    // Projection of point onto the line segment (parametric equation)
    let t = ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) / lineLengthSquared;

    // Clamp t to the range [0, 1] to ensure it lies on the segment
    t = Math.max(0, Math.min(1, t));

    // Compute the closest point on the line segment
    const closestPoint = {
        x: x1 + t * (x2 - x1),
        y: y1 + t * (y2 - y1),
    };

    // Compute the distance from the point to the closest point
    const distance = Math.sqrt(
        (closestPoint.x - px) ** 2 + (closestPoint.y - py) ** 2,
    );

    // Check if the distance is within the buffer
    return distance <= buffer;

    // Example usage:
    // const point = { x: 5, y: 5 };
    // const line = { start: { x: 0, y: 0 }, end: { x: 10, y: 0 } };
    // const buffer = 3;

    // console.log(isPointNearLine(point, line, buffer)); // true
}
