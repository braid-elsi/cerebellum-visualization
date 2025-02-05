class Branch {
    constructor({ length, angle, line, level, branches }) {
        this.length = length;
        this.angle = angle;
        this.line = line;
        this.level = level;
        this.branches = branches;
    }

    render() {
        strokeWeight(3);
        const { start, end } = this.line;
        line(start.x, start.y, end.x, end.y);
    }
}

class Tree {
    constructor(levels, maxBranches, startX, startY, targetPoints = []) {
        this.levels = levels;
        this.maxBranches = maxBranches;
        this.targetPoints = targetPoints.slice(); // Copy to avoid mutation
        this.usedTargets = new Set();
        this.branches = this.generateBranches(0, -PI / 2, startX, startY);
    }

    generateBranches(level, angle, x, y, target = null) {
        if (level >= this.levels - 1) {
            // If we are at the last level, connect branches to available target points
            return this.assignTargetBranches(x, y, angle);
        }

        let numBranches = Math.floor(Math.random() * this.maxBranches) + 1;
        let branches = [];

        for (let i = 0; i < numBranches; i++) {
            let newAngle = angle + random(-PI / 4, PI / 4);
            let length = Math.random() * 100 + 20;

            // Find the nearest unused target point
            let closestTarget = this.getClosestTarget(x, y);
            if (closestTarget) {
                let targetAngle = atan2(
                    closestTarget.y - y,
                    closestTarget.x - x,
                );
                newAngle = lerp(newAngle, targetAngle, 0.3); // Slightly adjust toward the target
                length = lerp(
                    length,
                    dist(x, y, closestTarget.x, closestTarget.y) /
                        (this.levels - level),
                    0.5,
                );
            }

            let endX = x + cos(newAngle) * length;
            let endY = y + sin(newAngle) * length;

            let childBranches = this.generateBranches(
                level + 1,
                newAngle,
                endX,
                endY,
                closestTarget,
            );

            const branch = new Branch({
                length,
                angle: newAngle,
                line: { start: { x, y }, end: { x: endX, y: endY } },
                level,
                branches: childBranches,
            });

            branches.push(branch);
        }
        return branches;
    }

    getClosestTarget(x, y) {
        let minDist = Infinity;
        let closest = null;

        for (let target of this.targetPoints) {
            if (this.usedTargets.has(target)) continue;

            let d = dist(x, y, target.x, target.y);
            if (d < minDist) {
                minDist = d;
                closest = target;
            }
        }

        return closest;
    }

    getUnusedTargetPoint() {
        return (
            this.targetPoints.find((pt) => !this.usedTargets.has(pt)) || null
        );
    }

    assignTargetBranches(x, y, angle) {
        let branches = [];
        for (let target of this.targetPoints) {
            if (!this.usedTargets.has(target)) {
                let length = dist(x, y, target.x, target.y);
                let newAngle = atan2(target.y - y, target.x - x);

                const branch = new Branch({
                    length,
                    angle: newAngle,
                    line: { start: { x, y }, end: target },
                    level: this.levels - 1,
                    branches: null, // No further children
                });

                branches.push(branch);
                this.usedTargets.add(target);
            }
        }
        return branches.length > 0 ? branches : null; // Return null if no target branches are needed
    }
}

const targetPoints = [
    { x: 300, y: 200 },
    { x: 400, y: 250 },
    { x: 500, y: 300 },
];

let tree;
let screenW = document.documentElement.clientWidth - 30;
let screenH = document.documentElement.clientHeight - 20;

function setup() {
    createCanvas(screenW, screenH);
    background(255);

    tree = new Tree(getRandomInt(4, 12), 2, screenW / 2, height, targetPoints);
}

let counter = 0;
function draw() {
    background(255);
    drawBranches(tree);
    for (point of targetPoints) {
        ellipse(point.x, point.y, 30, 30);
    }
}

function drawBranches(branch) {
    const branches = branch.branches;
    if (!branches) {
        return;
    }

    for (let branch of branches) {
        branch.render();
        drawBranches(branch);
    }
}

// for later: how to serialize / deserialize the tree structure from data:
function serializeBranch(branch) {
    return {
        start: branch.line.start,
        end: branch.line.end,
        angle: branch.angle,
        length: branch.length,
        level: branch.level,
        branches: branch.branches ? branch.branches.map(serializeBranch) : null,
    };
}

function deserializeBranch(data) {
    return new Branch({
        length: data.length,
        angle: data.angle,
        line: {
            start: data.start,
            end: data.end,
        },
        level: data.level,
        branches: data.branches ? data.branches.map(deserializeBranch) : null,
    });
}

function deserializeTree(jsonData) {
    return jsonData.map(deserializeBranch);
}

function serializeTree(tree) {
    return tree.branches.map(serializeBranch);
}
