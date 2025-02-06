// Example Usage
const loadFromFile = true;
const trees = [];
const treeData = [];
let spikes = [];
let screenW = document.documentElement.clientWidth - 30;
let screenH = document.documentElement.clientHeight - 20;

function setup() {
    frameRate(60); // 60 FPS is the max on many machines
    createCanvas(screenW, screenH);
    background(255);

    if (loadFromFile) {
        loadTreeFromFile();
    } else {
        generateTreeRandomly();
    }
}

function generateTreeRandomly() {
    // init trees
    let startX = screenW / 2;
    for (let i = 0; i < 1; i++) {
        const tree = new Tree({
            levels: getRandomInt(4, 12),
            maxBranches: 2,
            startX,
            startY: height,
        });
        console.log(tree.toJSON());
        trees.push(tree);
        treeData.push(tree.toJSON());
        startX += 200;
    }
    // init spikes:
    for (const tree of trees) {
        initSpikes(tree);
    }
}

async function loadTreeFromFile() {
    const response = await fetch("./src/axon.json");
    const treeJSON = await response.json();
    const tree = unflattenTree(treeJSON);
    trees.push(tree);

    // init spikes:
    for (const tree of trees) {
        initSpikes(tree);
    }
}

function initSpikes(tree) {
    for (const branch of tree.branches) {
        spikes.push(
            new Spike({
                w: 16,
                branch: branch,
                progress: 0,
            }),
        );
    }
}

function addRandomSpikes() {
    // pick a few of the trees:
    const selectedTrees = getRandomItems(trees, 1);
    for (const tree of selectedTrees) {
        for (const b of tree.branches) {
            spikes.push(new Spike({ w: 16, branch: b, progress: 0 }));
        }
    }
}

function drawBranches(branch) {
    const branches = branch.branches;
    if (branch.terminal) {
        branch.terminal.render();
        return;
    }

    if (!branches) {
        return;
    }
    for (let branch of branches) {
        branch.render();
        drawBranches(branch);
    }
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
    drawSpikes();

    // introduce new spikes to the system every so often:
    if (counter % 500 === 0) {
        addRandomSpikes();
    }
}
