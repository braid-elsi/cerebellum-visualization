// Example Usage
const trees = [];
let spikes = [];
let terminals = [];
let screenW = document.documentElement.clientWidth - 30;
let screenH = document.documentElement.clientHeight - 20;

function setup() {
    createCanvas(screenW, screenH);
    background(255);
    stroke(0);
    let startX = 100;
    for (let i = 0; i < 6; i++) {
        const tree = new Tree(getRandomInt(4, 12), 2, startX, height);
        trees.push(tree);
        drawBranches(tree);
        for (const branch of tree.branches) {
            spikes.push(
                new Spike({
                    w: 16,
                    x: branch.line.start.x,
                    y: branch.line.start.y,
                    branch: branch,
                    progress: 0,
                }),
            );
        }
        startX += 200;
    }
}

function drawBranches(branch) {
    const branches = branch.branches;
    if (!branches) {
        branch.terminal.render();
        return;
    }

    for (let branch of branches) {
        branch.render();
        drawBranches(branch);
    }
}

let counter = 0;
function draw() {
    background(255);
    for (const tree of trees) {
        drawBranches(tree);
    }

    strokeWeight(0);
    for (let i = spikes.length - 1; i >= 0; i--) {
        let c = spikes[i];
        let branch = c.branch;
        if (!branch) {
            spikes.splice(i, 1);
            continue;
        }

        c.move();
        c.render();

        if (c.progress >= branch.length) {
            if (branch.branches) {
                for (let child of branch.branches) {
                    const { start } = child.line;
                    spikes.push(
                        new Spike({
                            w: c.w * 0.9,
                            x: start.x,
                            y: start.y,
                            branch: child,
                            progress: 0,
                        }),
                    );
                }
            } else {
                branch.terminal.render([255, 0, 0]);
                console.log("you have reached the terminal button");
            }
            spikes.splice(i, 1);
        }
    }
    ++counter;

    // add new spikes
    if (counter % 10 === 0) {
        const selectedTrees = getRandomItems(trees, 1);
        for (const tree of selectedTrees) {
            for (const branch of tree.branches) {
                spikes.push(
                    new Spike({
                        w: 16,
                        x: branch.x,
                        y: branch.y,
                        branch: branch,
                        progress: 0,
                    }),
                );
            }
        }
    }
}
