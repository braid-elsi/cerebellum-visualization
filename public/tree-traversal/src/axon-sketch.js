// Example Usage
const loadFromFile = true;
const trees = [];
const neurons = [];
const spikeManager = new SpikeManager();
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

    [100, 300, 500, 700, 900].forEach((x) => {
        neurons.push(
            new GranuleCell({
                x: x + 100, //screenW / 2,
                y: height / 2,
                width: 50,
            }),
        );
    });

    neurons.forEach((neuron) => {
        spikeManager.initSpikes({
            tree: neuron.dendrites,
            direction: "inbound",
        });
    });
}

function draw() {
    background(255);
    neurons.forEach((neuron) => neuron.render());
    // trees.forEach((tree) => tree.render());
    spikeManager.render();
    periodicallyAddNewSpikes(++counter);
}

function periodicallyAddNewSpikes(counter) {
    if (counter % 30 === 0) {
        neurons.forEach((neuron) => {
            spikeManager.addRandomSpikes({
                tree: neuron.dendrites,
                direction: "inbound",
                n: 1,
            });
        });
    }
}
