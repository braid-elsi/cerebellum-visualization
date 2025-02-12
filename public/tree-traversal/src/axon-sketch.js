// Example Usage
const loadFromFile = true;
const trees = [];
const neurons = [];
const spikeManager = new SpikeManager();
const screenW = document.documentElement.clientWidth - 30;
const screenH = document.documentElement.clientHeight - 20;
let counter = 1;

async function setup() {
    createCanvas(screenW, screenH * 3);

    frameRate(60); // 60 FPS is the max on many machines
    background(255);

    let tree;
    if (loadFromFile) {
        tree = await loadTreeFromFile("./src/axon.json");
    } else {
        tree = RandomTreeGenerator.generate({
            startX: screenW / 2,
            startY: height,
            maxLevel: getRandomInt(4, 8),
            maxBranches: 2,
        });
        console.log(tree.toJSON());
    }
    trees.push(tree);

    const cell1 = new GranuleCell({
        x: screenW / 2,
        y: 200,
        width: getRandomInt(30, 50),
    });
    cell1.generateAxon();

    const cell2 = new GranuleCell({
        x: screenW / 2,
        y: 400,
        width: getRandomInt(30, 50),
    });
    cell2.generateAxon(cell1);

    const cell3 = new GranuleCell({
        x: screenW / 2 - 100,
        y: 600,
        width: getRandomInt(30, 50),
    });
    cell3.generateAxon(cell2);

    neurons.push(cell1);
    neurons.push(cell2);
    neurons.push(cell3);

    // neurons.forEach((neuron) => {
    //     neuron.generateAxon(); // here is where I can pass in a list of target receptors
    // });

    neurons.forEach((neuron) => {
        spikeManager.initSpikes({
            tree: neuron.dendrites.tree,
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

// function addGranuleCell() {
//     const neuron = new GranuleCell({
//         x: getRandomInt(0, screenW),
//         y: getRandomInt(0, screenH),
//         width: getRandomInt(30, 50),
//     });
//     neurons.push(neuron);
//     neuron.generateAxon();
// }

// function addNeuron() {
//     const neuron = new Neuron({
//         x: getRandomInt(0, screenW),
//         y: getRandomInt(0, screenH),
//         width: getRandomInt(30, 50),
//     });
//     neurons.push(neuron);
//     neuron.generateAxon();
// }

function periodicallyAddNewSpikes(counter) {
    if (counter % 30 === 0) {
        neurons.forEach((neuron) => {
            spikeManager.addRandomSpikes({
                tree: neuron.dendrites.tree,
                direction: "inbound",
                n: 1,
            });
        });
        // addNeuron();
    }
}
