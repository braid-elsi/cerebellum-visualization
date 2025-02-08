// Example Usage
const loadFromFile = true;
const direction = "outbound"; // outbound inbound
const trees = [];
const treeData = [];
const spikeManager = new SpikeManager(direction);
const screenW = document.documentElement.clientWidth - 30;
const screenH = document.documentElement.clientHeight - 20;
let counter = 1;

async function setup() {
    createCanvas(screenW, screenH);

    frameRate(60); // 60 FPS is the max on many machines
    background(255);

    let tree;
    if (loadFromFile) {
        tree = await loadTreeFromFile("./src/axon.json");
    } else {
        tree = TreeUtils.generateRandomTree({
            startX: screenW / 2,
            startY: height,
            maxLevel: getRandomInt(4, 8),
            maxBranches: 2,
        });
        console.log(tree.toJSON());
    }
    trees.push(tree);

    // init spikes:
    for (const tree of trees) {
        spikeManager.initSpikes(tree);
    }
}

function draw() {
    background(255);
    trees.forEach((tree) => tree.render());
    spikeManager.render();
    periodicallyAddNewSpikes(++counter);
}

function periodicallyAddNewSpikes(counter) {
    if (counter % 60 === 0) {
        const selectedTrees = getRandomItems(trees, 1);
        for (const tree of selectedTrees) {
            spikeManager.addRandomSpikes(tree, 1);
        }
    }
}

function mouseClicked() {
    spikeManager.toggleDirection();
}
