import p5Lib from "p5";
import SpikeManager from "./spike-manager.js";
import GranuleCell from "./neurons/granule-cell.js";
import MossyFiberNeuron from "./neurons/mossy-fiber-neuron.js";
import { getRandomInt } from "./utils.js";

const neurons = [];
const spikeManager = new SpikeManager();
const screenW = document.documentElement.clientWidth - 30;
const screenH = document.documentElement.clientHeight - 20;
let counter = 1;
let randomInterval1 = 30;
let randomInterval2 = 50;
let randomInterval3 = 70;
let mf1, mf2, mf3;

// Create a new p5 instance
(function initializeApp() {
    new p5Lib(function (p5) {
        p5.frameRate(20);
        p5.setup = () => setup(p5);
        p5.draw = () => draw(p5);
    });
})();

async function setup(p5) {
    p5.createCanvas(screenW, screenH * 3);

    p5.frameRate(60); // 60 FPS is the max on many machines
    p5.background(255);

    for (let i = 0; i < 7; i++) {
        const gc = new GranuleCell({
            x: 125 * i + 50,
            y: screenH / 2,
            width: getRandomInt(30, 50),
        });
        neurons.push(gc);
    }

    mf1 = new MossyFiberNeuron({
        x: 425,
        y: screenH / 2 + 500,
        width: 60,
    });
    // mf1.connectTo(neurons[0], getRandomInt(2, 5));
    // mf1.connectTo(neurons[1], getRandomInt(2, 5));
    // mf1.connectTo(neurons[2], 1);

    mf2 = new MossyFiberNeuron({
        x: 175,
        y: screenH / 2 + 500,
        width: 60,
    });
    mf2.connectTo(neurons[0], getRandomInt(2, 3));
    mf2.connectTo(neurons[1], getRandomInt(2, 4));
    mf2.connectTo(neurons[2], getRandomInt(2, 4));

    mf3 = new MossyFiberNeuron({
        x: 675,
        y: screenH / 2 + 500,
        width: 60,
    });
    mf3.connectTo(neurons[4], 1);
    mf3.connectTo(neurons[5], 2);
    mf3.connectTo(neurons[6], 3);

    // order matters here: first make the connections, then generate all the dendrites,
    // then generate all the axon connections
    neurons.forEach((gc) => mf1.connectTo(gc, getRandomInt(1, 4)));
    neurons.forEach((gc) => gc.generateDendrites());
    mf1.generateDendrites();
    mf2.generateDendrites();
    mf3.generateDendrites();
    neurons.forEach((gc) => gc.generateAxon());
    mf1.generateAxon();
    mf2.generateAxon();
    mf3.generateAxon();
}

function draw(p5) {
    p5.background(255);
    neurons.forEach((neuron) => neuron.render(p5));
    mf1.render(p5);
    mf2.render(p5);
    mf3.render(p5);
    spikeManager.render(p5);
    periodicallyAddNewSpikes(++counter, p5);
}

function periodicallyAddNewSpikes(counter, p5) {
    if (counter % randomInterval1 === 0) {
        for (const neuron of [mf1]) {
            spikeManager.addRandomSpikes(
                {
                    tree: neuron.axon.tree,
                    direction: "outbound",
                    n: 1,
                    color: [0, 200, 200], // [200, 0, 200],
                },
                p5,
            );
        }
        randomInterval1 = getRandomInt(10, 80);
    }

    if (counter % randomInterval2 === 0) {
        for (const neuron of [mf2]) {
            console.log(neuron);
            spikeManager.addRandomSpikes(
                {
                    tree: neuron.axon.tree,
                    direction: "outbound",
                    n: 1,
                    color: [200, 0, 200],
                },
                p5,
            );
        }
        randomInterval2 = getRandomInt(40, 150);
    }

    if (counter % randomInterval3 === 0) {
        for (const neuron of [mf3]) {
            console.log(neuron);
            spikeManager.addRandomSpikes(
                {
                    tree: neuron.axon.tree,
                    direction: "outbound",
                    n: 1,
                    color: [0, 0, 200],
                },
                p5,
            );
        }
        randomInterval3 = getRandomInt(40, 150);
    }
}
