// Example Usage
const loadFromFile = true;
const trees = [];
const neurons = [];
const spikeManager = new SpikeManager();
const screenW = document.documentElement.clientWidth - 30;
const screenH = document.documentElement.clientHeight - 20;
let counter = 1;
let randomInterval = 30;

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
        x: screenW / 2 - 50,
        y: 550,
        width: getRandomInt(30, 50),
    });
    cell2.generateAxon(cell1);

    // const cell3 = new GranuleCell({
    //     x: screenW / 2,
    //     y: 500,
    //     width: getRandomInt(30, 50),
    // });
    // cell3.generateAxon(cell2);

    // const cell4 = new GranuleCell({
    //     x: screenW / 2 - 200,
    //     y: 750,
    //     width: getRandomInt(30, 50),
    // });
    // cell4.generateAxon(cell3);

    neurons.push(cell1);
    neurons.push(cell2);
    // neurons.push(cell3);
    // neurons.push(cell4);

    // neurons.forEach((neuron) => {
    //     neuron.generateAxon(); // here is where I can pass in a list of target receptors
    // });

    // neurons.forEach((neuron) => {
    //     spikeManager.initSpikes({
    //         tree: neuron.dendrites.tree,
    //         direction: "inbound",
    //     });
    // });
}

function draw() {
    background(255);
    neurons.forEach((neuron) => neuron.render());
    // trees.forEach((tree) => tree.render());
    spikeManager.render();
    periodicallyAddNewSpikes(++counter);
}

function periodicallyAddNewSpikes(counter) {
    if (counter % randomInterval === 0) {
        const neuron = neurons[neurons.length - 1];
        // neurons.forEach((neuron) => {
        spikeManager.addRandomSpikes({
            tree: neuron.dendrites.tree,
            direction: "inbound",
            n: 1,
        });
        // });
        randomInterval = getRandomInt(10, 80);
    }
}
