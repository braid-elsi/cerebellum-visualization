let originX, originY;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    originX = width / 2; // Central point of the canvas
    originY = height; // Central point of the canvas
    noLoop(); // Draw only once
}

function draw() {
    background(255);

    // Draw the central point (the cell body)
    for (let i = 0; i < 6; i++) {
        fill(0);
        ellipse(i * 200 + 150, originY, 10, 10);

        // Draw the mossy fiber with recursive branching
        drawBranch(i * 200 + 150, originY, height / 5, (TWO_PI / 4) * 3, 6);
    }
}

// Recursive function to draw branches
function drawBranch(x, y, length, angle, depth) {
    if (depth === 0) return; // Stop recursion at maximum depth

    // Calculate the endpoint of the branch
    let xEnd = x + (cos(angle) * length) / 2;
    let yEnd = y + (sin(angle) * length) / 2;

    // Draw the branch (line)
    stroke(0);
    line(x, y, xEnd, yEnd);

    x = xEnd;
    y = yEnd;
    xEnd = x;
    yEnd = y - length;
    line(x, y, xEnd, yEnd);

    // Optionally, draw a small circle at the end of the branch to represent a synapse
    fill(100, 100, 250);
    ellipse(xEnd, yEnd, 5, 5);

    // Recursive call to draw smaller branches
    // Randomize the angles and lengths for each new branch
    drawBranch(xEnd, yEnd, length * 0.7, -PI / 4, depth - 1); // Left branch
    drawBranch(xEnd, yEnd, length * 0.7, -PI / 2, depth - 1);
    drawBranch(xEnd, yEnd, length * 0.7, -PI + PI / 4, depth - 1); // Right branch
}
