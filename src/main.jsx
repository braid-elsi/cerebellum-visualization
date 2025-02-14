import p5Lib from "p5";
import SpikeManager from "./spike-manager.js";
import { loadTreeFromFile } from "./utils.js";
import { GranuleCell } from "./neuron.js";
import { getRandomInt } from "./utils.js";

const loadFromFile = true;
const trees = [];
const neurons = [];
const spikeManager = new SpikeManager();
const screenW = document.documentElement.clientWidth - 30;
const screenH = document.documentElement.clientHeight - 20;
let counter = 1;
let randomInterval = 30;

// Create a new p5 instance
(function initializeApp() {
    new p5Lib(function (p5) {
        p5.frameRate(40);
        p5.setup = () => setup(p5);
        p5.draw = () => draw(p5);
    });
})();

async function setup(p5) {
    p5.createCanvas(screenW, screenH * 3);

    p5.frameRate(60); // 60 FPS is the max on many machines
    p5.background(255);

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
        y: 450,
        width: getRandomInt(30, 50),
    });
    cell2.generateAxon([cell1]);

    const cell3 = new GranuleCell({
        x: screenW / 2,
        y: 700,
        width: getRandomInt(30, 50),
    });
    cell3.generateAxon([cell1, cell2]);

    // const cell4 = new GranuleCell({
    //     x: screenW / 2 - 200,
    //     y: 750,
    //     width: getRandomInt(30, 50),
    // });
    // cell4.generateAxon(cell3);

    neurons.push(cell1);
    neurons.push(cell2);
    neurons.push(cell3);
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

function draw(p5) {
    p5.background(255);
    neurons.forEach((neuron) => neuron.render(p5));
    spikeManager.render(p5);
    periodicallyAddNewSpikes(++counter, p5);
}

function periodicallyAddNewSpikes(counter, p5) {
    if (counter % randomInterval === 0) {
        const neuron = neurons[neurons.length - 1];
        spikeManager.addRandomSpikes(
            {
                tree: neuron.dendrites.tree,
                direction: "inbound",
                n: 1,
            },
            p5,
        );
        randomInterval = getRandomInt(10, 80);
    }
}
