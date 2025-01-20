let path = [
    { x: 500, y: 500 },
    { x: 500, y: 400 },
    { x: 200, y: 200 },
    { x: 100, y: 400 },
    { x: 500, y: 500 },
];
let currentPointIndex = 0; // Current segment of the path
let t = 0; // Interpolation parameter (0 to 1)
let speed = 5; // Speed of the ball (pixels per frame)
let segmentLength = 0; // Length of the current segment

function setup() {
    createCanvas(600, 600);
    noStroke();

    // Calculate the length of the first segment
    segmentLength = dist(path[0].x, path[0].y, path[1].x, path[1].y);
}

function draw() {
    background(240);

    // Draw the path as circles for reference
    for (let point of path) {
        fill(100, 200, 255);
        circle(point.x, point.y, 10);
    }

    // Ensure we stay within the bounds of the path
    if (currentPointIndex < path.length - 1) {
        // Get the current and next points
        let current = path[currentPointIndex];
        let next = path[currentPointIndex + 1];

        // Interpolate position
        let x = lerp(current.x, next.x, t);
        let y = lerp(current.y, next.y, t);

        // Draw the ball
        fill(255, 100, 100);
        circle(x, y, 20);

        // Update interpolation parameter based on speed
        t += speed / segmentLength;

        // If we've reached the next point, move to the next segment
        if (t >= 1) {
            t = 0; // Reset interpolation
            currentPointIndex++; // Advance to the next segment

            // Calculate the length of the new segment
            if (currentPointIndex < path.length - 1) {
                segmentLength = dist(
                    path[currentPointIndex].x,
                    path[currentPointIndex].y,
                    path[currentPointIndex + 1].x,
                    path[currentPointIndex + 1].y
                );
            }
        }
    } else {
        // Loop back to the start of the path
        currentPointIndex = 0;
        t = 0;
        segmentLength = dist(path[0].x, path[0].y, path[1].x, path[1].y);
    }
}
