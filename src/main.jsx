import p5Lib from "p5";
import SpikeManager from "./spike-manager.js";
import { GranuleCell, Neuron } from "./neuron.js";
import { getRandomInt } from "./utils.js";

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

    Array.from({ length: 4 }).forEach((item, idx) => {
        const gc = new GranuleCell({
            x: screenW / 2 + Math.random() * 200 - 100,
            y: 200 + idx * 250,
            width: getRandomInt(30, 50),
        });
        if (idx > 0) {
            // the previous neuron should be connected to the current neuron:
            gc.connectTo(neurons[idx - 1], getRandomInt(2, 4));
        }
        neurons.push(gc);
    });

    const gc = new GranuleCell({
        x: screenW / 2 + 200,
        y: 450,
        width: getRandomInt(30, 50),
    });
    gc.connectTo(neurons[0], 3);
    neurons[2].connectTo(gc, 3);
    neurons.push(gc);

    neurons.forEach((gc) => gc.generateDendrites());
    neurons.forEach((gc) => gc.generateAxon());
}

function draw(p5) {
    p5.background(255);
    neurons.forEach((neuron) => neuron.render(p5));
    spikeManager.render(p5);
    periodicallyAddNewSpikes(++counter, p5);
}

function periodicallyAddNewSpikes(counter, p5) {
    if (counter % randomInterval === 0) {
        const neuron = neurons[3];
        spikeManager.addRandomSpikes(
            {
                tree: neuron.axon.tree,
                direction: "outbound",
                n: 1,
            },
            p5,
        );
        randomInterval = getRandomInt(10, 80);
    }
}
