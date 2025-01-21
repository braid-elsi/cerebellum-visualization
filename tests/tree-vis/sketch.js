// let startX;
// let startY;
// let length;
// let angle;
// let angleDiff = Math.PI / 2;
// let stopPoint = 15;
// let variationPoint = 20;
// let color = [254, 82, 0];

// function setup() {
//     noLoop();
//     frameRate(1);
//     createCanvas(800, 600);
//     background(255);
//     stroke(...color);
//     fill(...color);
//     // noFill();

//     // Initial position and size
//     length = 100;
//     startX = width / 2;
//     startY = height - length;
//     angle = -PI / 2; // Start angle pointing upwards

//     // Draw the tree
//     drawTree();
// }

// function draw() {
//     clear();
//     drawTree();
// }

// function drawTree() {
//     length = 100;
//     angleDiff = Math.PI / 4;
//     fill(...color);
//     drawBranch(startX, startY, length, angle, 0);
//     fill(...color);
//     ellipse(startX, startY, length / 4, length / 2);
// }

// function drawBranch(x, y, len, angle, iteration) {
//     // Randomize the angle to create curvy branches
//     let angleVariation = random(-PI / 12, PI / 12); // Smaller angle variation for curvy effect
//     let curvyAngle = angle + sin(iteration * 0.2) * angleVariation; // Sine function adds a smooth curve

//     // Randomize the branch length slightly for variety
//     let lenVariation = random(0.7, 0.9); // Length multiplier between 70% and 90%
//     let newLen = len * lenVariation;

//     // Base case: Stop drawing when the branch is too short
//     if (iteration > 7) {
//         strokeWeight(2);
//         noFill();
//         ellipse(x, y, 10, 10);
//         return;
//     }

//     // Calculate the endpoint of the current branch
//     let xEnd = x + newLen * cos(curvyAngle);
//     let yEnd = y + newLen * sin(curvyAngle);
//     strokeWeight(Math.max(6 - (iteration + 1) * 0.6, 1));
//     line(x, y, xEnd, yEnd);

//     let mulTest1 = random(-1, 1);
//     let mulTest2 = random(-1, 1);

//     // Recursively draw the two branches with smaller lengths and different curvy angles
//     drawBranch(xEnd, yEnd, newLen, curvyAngle + angleDiff * mulTest1, iteration + 1); // Left branch
//     drawBranch(xEnd, yEnd, newLen, curvyAngle + angleDiff * mulTest2, iteration + 1); // Right branch
// }

// function setup() {
//     createCanvas(600, 600);
//     background(255);
//     noFill();

//     // Initial tree parameters
//     let startX = width / 2;
//     let startY = height;
//     let length = 120;
//     let angle = -PI / 2; // Start angle pointing upwards

//     // Start drawing the tree
//     drawBranch(startX, startY, length, angle, 0);
// }

// function drawBranch(x, y, len, angle, iteration) {
//     // Base case: Stop drawing if the branch length is too small
//     if (len < 15) return;

//     // Randomize angle and length for a more natural look
//     let angleVariation = random(-PI / 8, PI / 8);
//     let curvyAngle = angle + noise(iteration * 0.1) * angleVariation; // Organic curvature
//     let lenVariation = random(0.7, 0.9);
//     let newLen = len * lenVariation;

//     // Calculate endpoint of the branch
//     let xEnd = x + newLen * cos(curvyAngle);
//     let yEnd = y + newLen * sin(curvyAngle);

//     // Draw the branch with varying thickness and color
//     strokeWeight(map(len, 5, 120, 1, 6));
//     stroke(34, random(80, 130), 34); // Mossy green
//     line(x, y, xEnd, yEnd);

//     // Add random mossy filaments along the branch
//     for (let i = 0; i < random(2, 5); i++) {
//         let offsetX = lerp(x, xEnd, random());
//         let offsetY = lerp(y, yEnd, random());
//         drawFilament(offsetX, offsetY, newLen * 0.2, random(TWO_PI));
//     }

//     // Recursively draw left and right branches
//     drawBranch(xEnd, yEnd, newLen, curvyAngle - PI / 6, iteration + 1); // Left branch
//     drawBranch(xEnd, yEnd, newLen, curvyAngle + PI / 6, iteration + 1); // Right branch

//     // Add chaotic sub-branches for density
//     if (random() < 0.4) {
//         drawBranch(
//             xEnd,
//             yEnd,
//             newLen * 0.6,
//             curvyAngle + random(-PI / 4, PI / 4),
//             iteration + 1
//         );
//     }
// }

// // Draw small filaments for mossy texture
// function drawFilament(x, y, len, angle) {
//     if (len < 1) return; // Stop if filament is too short

//     let lenVariation = random(0.5, 0.8);
//     let newLen = len * lenVariation;

//     let xEnd = x + newLen * cos(angle);
//     let yEnd = y + newLen * sin(angle);

//     strokeWeight(2.5);
//     stroke(50, random(180, 220), 50, 150); // Light green, slightly transparent
//     line(x, y, xEnd, yEnd);
// }

function setup() {
    createCanvas(600, 600);
    background(30);
    noLoop();
    stroke(255, 80, 80); // Red coral color
}

function draw() {
    translate(width / 2, height); // Start at the bottom center
    drawCoral(150, -PI / 2, 10, 1); // Start with level 1
}

function drawCoral(len, angle, thickness, level) {
    // Stop recursion after 7 levels
    if (level > 7) {
        return;
    }

    // Customize branch appearance based on level
    let xEnd, yEnd;
    if (level === 5) {
        // Long vertical branches at the final level
        xEnd = 0; // No horizontal stretch
        yEnd = -len * 15; // Extend vertically
    } else {
        // Regular branching with some randomness
        xEnd = len * cos(angle);
        yEnd = len * sin(angle);
    }

    // Draw the current branch
    strokeWeight(thickness);
    stroke(255, random(50, 100), random(50, 100)); // Slight color variation
    line(0, 0, xEnd, yEnd);

    // Move to the end of the branch
    push();
    translate(xEnd, yEnd);

    // Branching logic for levels 1-6
    if (level < 5) {
        let numBranches = floor(random(2, 4)); // Random 2-3 branches for irregularity
        for (let i = 0; i < numBranches; i++) {
            // Generate new angle, length, and thickness
            let newAngle = angle + random(-PI / 4, PI / 4);
            let newLen = len * random(0.5, 0.8);
            let newThickness = thickness * random(0.6, 0.8);

            // Recurse to draw child branches
            drawCoral(newLen, newAngle, newThickness, level + 1);
        }
    } else {
        // Level 7: No further branching
        // Draws long vertical branches only
        stroke(200, 50, 50); // Darker red for the final branches
    }

    pop();
}
