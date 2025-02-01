let animationProgress = 0; // Tracks the progress of the animation (0 = arches, 1 = lines)
const numArches = 5; // Number of concentric arches
const maxRadius = 200; // Maximum radius of the arches
const centerX = 400; // Center X of the canvas
const centerY = 300; // Center Y of the canvas

function setup() {
    createCanvas(800, 600); // Set up the canvas
    noFill(); // No fill for the arches and lines
    stroke(0); // Black stroke color
    strokeWeight(2); // Stroke weight for visibility
}

function draw() {
    background(255); // Clear the canvas each frame

    // Animate the arches into horizontal lines
    for (let i = 0; i < numArches; i++) {
        const radius = maxRadius + i * 40; // Radius for each arch
        const startAngle = -HALF_PI; // Start angle of the arch
        const endAngle = HALF_PI; // End angle of the arch

        // Interpolate between the arch and the line
        const animatedStartAngle = lerp(startAngle, -PI, animationProgress);
        const animatedEndAngle = lerp(endAngle, PI, animationProgress);

        // Draw the animated arch (flattening into a line)
        arc(
            centerX,
            centerY,
            radius * 2,
            radius * 2 * (1 - animationProgress), // Flatten the height of the arch
            animatedStartAngle,
            animatedEndAngle,
        );
    }

    // Update the animation progress
    if (animationProgress < 1) {
        animationProgress += 0.005; // Adjust speed of animation
    }
}
