// Example Usage
const loadFromFile = false;
const direction = "outbound"; // outbound inbound
const trees = [];
const treeData = [];
const spikeManager = new SpikeManager(direction);
let screenW = document.documentElement.clientWidth - 30;
let screenH = document.documentElement.clientHeight - 20;

async function setup() {
    frameRate(60); // 60 FPS is the max on many machines
    createCanvas(screenW, screenH);
    background(255);

    let tree;
    if (loadFromFile) {
        tree = await loadTreeFromFile("./src/axon.json");
    } else {
        tree = Tree.generateRandomTree({
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

let counter = 1;
function draw() {
    background(255);
    for (const tree of trees) {
        tree.render();
    }

    spikeManager.render();

    if (counter % 60 === 0) {
        const selectedTrees = getRandomItems(trees, 1);
        for (const tree of selectedTrees) {
            spikeManager.addRandomSpikes(tree, 1);
        }
    }
    ++counter;
}

function mouseClicked() {
    spikeManager.toggleDirection();
}
