let leaves = [];
let branches = [];
let trunk;
let numPoints = 6;
let branchesPerCluster = 3;
let numLevels = Math.ceil(logBase(numPoints, branchesPerCluster)) + 1;
let screenW = document.documentElement.clientWidth - 30;
let screenH = document.documentElement.clientHeight - 20;

function logBase(x, base) {
    return Math.log(x) / Math.log(base);
}

function setup() {
    createCanvas(screenW, screenH);
    console.log(numLevels);

    // Define leaf positions (randomly placed)
    let leaves = [];
    for (let i = 0; i < numPoints; i++) {
        let x = 100 + i * 50;
        let y = 150 + i * 6;
        leaves.push(createVector(x, y));
    }

    // Define trunk position (final endpoint)
    let trunk = createVector((numPoints * 50 + 100) / 2 + 25, 500);

    // Create tree and generate branches
    let tree = LeafTreeGenerator.generate({
        leaves,
        trunk,
        levels: numLevels,
        branchFactor: branchesPerCluster,
    });

    // Render tree
    tree.render();
}

function render() {
    // console.log("start draw...");
    background(220);
    stroke(0);
    strokeWeight(2);

    // Draw branches
    for (let branch of branches) {
        line(branch.start.x, branch.start.y, branch.end.x, branch.end.y);
    }

    // Draw leaves (green)
    fill(0, 200, 0);
    for (let leaf of leaves) {
        ellipse(leaf.x, leaf.y, 10, 10);
    }

    // Draw trunk (brown)
    fill(139, 69, 19);
    ellipse(trunk.x, trunk.y, 15, 15);

    // console.log("end draw...");
}

// function draw() {
//     render();
// }

// function generateTree(levels, branchFactor) {
//     let points = [...leaves]; // Start with leaf nodes
//     let newBranches = [];
//     let levelSpacing = (trunk.y - min(leaves.map((p) => p.y))) / levels; // Vertical step size

//     for (let level = 1; level <= levels; level++) {
//         let newPoints = [];

//         // Group points into clusters of size `branchFactor`
//         for (let i = 0; i < points.length; i += branchFactor) {
//             let group = points.slice(i, i + branchFactor);

//             // Find average x-position and set y-level based on depth
//             let midX = group.reduce((sum, p) => sum + p.x, 0) / group.length;
//             let midY = min(group.map((p) => p.y)) + levelSpacing; // Move downward
//             let mid = createVector(midX, midY);

//             // Connect all group members to the midpoint
//             for (let p of group) {
//                 newBranches.push({ start: p, end: mid });
//             }

//             newPoints.push(mid);
//         }

//         points = newPoints; // Update points for next level
//         if (points.length === 1) break; // Stop when only one root remains
//     }

//     // Connect the final root node to the trunk
//     newBranches.push({ start: points[0], end: trunk });
//     branches = newBranches;
// }
