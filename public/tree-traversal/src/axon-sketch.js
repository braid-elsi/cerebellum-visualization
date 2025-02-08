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

    for (let i = 0; i < 2; i++) {
        addNeuron();
    }

    // x = 50;
    // while (x < screenW) {
    //     neurons.push(
    //         new GranuleCell({
    //             x: x,
    //             y: height / 2,
    //             width: 50,
    //         }),
    //     );
    //     neurons.push(
    //         new GranuleCell({
    //             x: x + 100,
    //             y: height / 2 + 250,
    //             width: 50,
    //         }),
    //     );
    //     neurons.push(
    //         new GranuleCell({
    //             x: x + 100,
    //             y: height / 2 - 300,
    //             width: 50,
    //         }),
    //     );
    //     x += 200;
    // }

    neurons.forEach((neuron) => {
        neuron.generateAxon(); // here is where I can pass in a list of target receptors
    });

    neurons.forEach((neuron) => {
        spikeManager.initSpikes({
            tree: neuron.dendrites,
            direction: "inbound",
        });
    });
}

function addNeuron() {
    const neuron = new GranuleCell({
        x: getRandomInt(0, screenW),
        y: getRandomInt(0, screenH),
        width: getRandomInt(30, 50),
    });
    neurons.push(neuron);
    neuron.generateAxon();
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
        addNeuron();
    }
}
