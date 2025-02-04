class Tree {
    constructor(levels, maxBranches, startX, startY) {
        this.levels = levels;
        this.maxBranches = maxBranches;
        this.root = this.generateBranch(0, -PI / 2, startX, startY);
    }

    generateBranch(level, angle, x, y) {
        if (level >= this.levels) return null;

        let numBranches = Math.floor(Math.random() * this.maxBranches) + 1;
        let branches = [];

        for (let i = 0; i < numBranches; i++) {
            let newAngle = angle + random(-PI / 6, PI / 6);
            let length = Math.random() * 100 + 20;
            let newX = x + cos(newAngle) * length;
            let newY = y + sin(newAngle) * length;
            let childBranches = this.generateBranch(
                level + 1,
                newAngle,
                newX,
                newY,
            );
            branches.push({
                length: length,
                angle: newAngle,
                x: x, // Store start point
                y: y, // Store start point
                endX: newX, // Store end point
                endY: newY, // Store end point
                children: childBranches,
            });
        }

        return branches;
    }
}

function getRandomItems(arr, n) {
    if (n > arr.length) {
        throw new Error("n cannot be larger than the array length");
    }

    let shuffled = arr.slice(); // Copy the array to avoid modifying the original
    for (let i = shuffled.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    return shuffled.slice(0, n); // Take the first n elements
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

// Example Usage
const trees = [];
let circles = [];
let terminals = [];
let screenW = document.documentElement.clientWidth - 30;
let screenH = document.documentElement.clientHeight - 20;

function setup() {
    createCanvas(screenW, screenH);
    background(255);
    stroke(0);
    let startX = 100;
    for (let i = 0; i < 6; i++) {
        const tree = new Tree(getRandomInt(4, 7), 2, startX, height);
        trees.push(tree);
        drawBranches(tree.root);
        for (const branch of tree.root) {
            circles.push({
                w: 10,
                x: branch.x,
                y: branch.y,
                branch: branch,
                progress: 0,
            });
        }
        startX += 200;
    }
}

function drawBranches(branches) {
    strokeWeight(3);
    if (!branches) return;

    for (let branch of branches) {
        line(branch.x, branch.y, branch.endX, branch.endY);
        drawBranches(branch.children);
    }
}

let counter = 0;
function draw() {
    background(255);
    for (const tree of trees) {
        drawBranches(tree.root);
    }


    strokeWeight(0);
    for (let i = circles.length - 1; i >= 0; i--) {
        let c = circles[i];
        let branch = c.branch;
        if (!branch) {
            ellipse(newX, newY, 20, 20);
            circles.splice(i, 1);
            continue;
        }

        c.progress += 2;
        let progressRatio = c.progress / branch.length;
        let newX = branch.x + progressRatio * (branch.endX - branch.x);
        let newY = branch.y + progressRatio * (branch.endY - branch.y);
        fill(255, 0, 0);
        ellipse(newX, newY, c.w, c.w);

        if (c.progress >= branch.length) {
            if (branch.children) {
                for (let child of branch.children) {
                    circles.push({
                        w: c.w * 0.9,
                        x: child.x,
                        y: child.y,
                        branch: child,
                        progress: 0,
                    });
                }
            } else {
                console.log("you have reached the terminal button");
                terminals.push({
                    x: newX,
                    y: newY,
                    w: 20,
                    angle: atan2(newY, newX),
                });
            }
            circles.splice(i, 1);
        }
    }
    ++counter;
    if (counter % 99 === 0) {
        const selectedTrees = getRandomItems(trees, 2);
        for (const tree of selectedTrees) {
            for (const branch of tree.root) {
                circles.push({
                    w: 10,
                    x: branch.x,
                    y: branch.y,
                    branch: branch,
                    progress: 0,
                });
            }
        }
    }

    for (const terminal of terminals) {
        angleMode(RADIANS);
        push();
        translate(terminal.x, terminal.y);
        console.log(terminal.angle);
        rotate(terminal.angle);
        ellipse(0, 0, terminal.w / 2, terminal.w * 1.4);
        pop();
    }
}
