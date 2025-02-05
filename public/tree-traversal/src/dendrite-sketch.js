// Example Usage
const trees = [];
let spikes = [];
let screenW = document.documentElement.clientWidth - 30;
let screenH = document.documentElement.clientHeight - 20;

function setup() {
    createCanvas(screenW, screenH);
    background(255);

    // init trees
    let startX = screenW / 2;
    for (let i = 0; i < 1; i++) {
        const tree = new Tree(getRandomInt(4, 12), 2, startX, height);
        trees.push(tree);
        startX += 200;
    }
    // init spikes:
    for (const tree of trees) {
        initSpikesDendrites(tree);
    }
}

function addTerminalSpikes(branch) {
    if (!branch.branches) {
        spikes.push(
            new Spike({ w: 16, branch: branch, progress: branch.length }),
        );
    } else {
        for (const child of branch.branches) {
            addTerminalSpikes(child);
        }
    }
}

function initSpikesDendrites(tree) {
    for (const branch of tree.branches) {
        addTerminalSpikes(branch);
    }
}

function addRandomSpikesDendrites() {
    // pick a few of the trees:
    const selectedTrees = getRandomItems(trees, 1);
    for (const tree of selectedTrees) {
        for (const b of tree.branches) {
            // spikes.push(new Spike({ w: 16, branch: b, progress: 0 }));
            addTerminalSpikes(b);
        }
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

function findParentBranch(targetBranch, branches = trees[0].branches) {
    for (const branch of branches) {
        if (branch.branches && branch.branches.includes(targetBranch)) {
            return branch;
        }
        let parent = findParentBranch(targetBranch, branch.branches || []);
        if (parent) return parent;
    }
    return null;
}

function drawSpikesDendrites() {
    strokeWeight(0);
    for (let i = spikes.length - 1; i >= 0; i--) {
        let spike = spikes[i];
        let branch = spike.branch;
        if (!branch) {
            spikes.splice(i, 1);
            continue;
        }

        // move spike:
        spike.move();
        spike.render();

        // Move to parent branch when reaching the start:
        if (spike.progress <= 0) {
            let parentBranch = findParentBranch(branch);
            if (parentBranch) {
                spikes.push(
                    new Spike({
                        w: spike.w * 0.9,
                        branch: parentBranch,
                        progress: parentBranch.length,
                    }),
                );
            } else {
                console.log("Spike reached the root");
            }
            spikes.splice(i, 1);
        }
    }
    ++counter;
}

function drawSpikes() {
    strokeWeight(0);
    for (let i = spikes.length - 1; i >= 0; i--) {
        let spike = spikes[i];
        let branch = spike.branch;
        if (!branch) {
            spikes.splice(i, 1);
            continue;
        }

        // move spike:
        spike.move();
        spike.render();

        // create new spikes to follow the child branches:
        if (spike.progress >= branch.length) {
            if (branch.branches) {
                for (let b of branch.branches) {
                    spikes.push(
                        new Spike({ w: spike.w * 0.9, branch: b, progress: 0 }),
                    );
                }
            } else {
                branch.terminal.render([255, 0, 0]);
                console.log("you have reached the terminal button");
            }
            // remove expired spike:
            spikes.splice(i, 1);
        }
    }
    ++counter;
}

let counter = 0;
function draw() {
    background(255);
    for (const tree of trees) {
        drawBranches(tree);
    }

    // draw spikes
    drawSpikesDendrites();

    // introduce new spikes to the system every so often:
    if (counter % 400 === 0) {
        // addRandomSpikes();
        addRandomSpikesDendrites();
    }
}
