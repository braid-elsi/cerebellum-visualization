import p5Lib from "p5";
import SpikeManager from "./spike-manager.js";
import GranuleCell from "./neurons/granule-cell.js";
import MossyFiberNeuron from "./neurons/mossy-fiber-neuron.js";
import PurkinjeNeuron from "./neurons/purkinje-neuron.js";
import DeepCerebellarNuclei from "./neurons/dcn.js";
import InferiorOlive from "./neurons/inferior-olive.js";
import { getRandomInt } from "./utils.js";

const neurons = [];
const spikeManager = new SpikeManager();
const screenW = document.documentElement.clientWidth - 30;
const screenH = document.documentElement.clientHeight - 20;
let counter = 0;
let randomInterval1 = 30;
let randomInterval2 = 50;
let mf1, mf2;
let pk1;
let dcn1;
let io1;
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

    for (let i = 0; i < 5; i++) {
        const gc = new GranuleCell({
            x: 125 * i + 50,
            y: screenH,
            width: getRandomInt(30, 50),
        });
        neurons.push(gc);
    }

    mf1 = new MossyFiberNeuron({
        x: 175,
        y: screenH + 500,
        width: 60,
    });

    mf2 = new MossyFiberNeuron({
        x: 300,
        y: screenH + 500,
        width: 60,
    });
    mf1.connectTo(neurons[0], getRandomInt(2, 3));
    mf1.connectTo(neurons[1], getRandomInt(2, 4));
    mf1.connectTo(neurons[2], getRandomInt(2, 4));

    pk1 = new PurkinjeNeuron({
        x: 800,
        y: screenH - 200,
        width: 60,
        color: [200, 100, 100],
    });

    io1 = new InferiorOlive({
        x: 1000,
        y: screenH + 550,
        width: 60,
        color: [97, 111, 237],
    });

    dcn1 = new DeepCerebellarNuclei({
        x: 800,
        y: screenH + 450,
        width: 130,
        color: [233, 194, 194]
    });

    pk1.connectTo(dcn1, 1);
    io1.connectTo(dcn1, 1);
    // order matters here: first make the connections, then generate all the dendrites,
    // then generate all the axon connections
    neurons.forEach((gc) => mf2.connectTo(gc, getRandomInt(1, 4)));
    mf2.connectTo(dcn1, 1);
    
    
    neurons.forEach((gc) => gc.generateDendrites());
    dcn1.generateDendrites()
    mf1.generateDendrites();
    mf2.generateDendrites();
    await pk1.generateDendrites();

    let xOffset = 40;
    const shuffledNeurons = [...neurons].sort(() => Math.random() - 0.5);
    shuffledNeurons.forEach((gc) => {
        gc.generateAxon(10 + xOffset);
        xOffset += getRandomInt(15, 80);
    });
    dcn1.generateAxon();
    io1.generateAxon();
    mf1.generateAxon();
    mf2.generateAxon();
    pk1.generateAxon();

    // find Purkinje dendrite intersections with Granule Cell axons:
    const totalConnections = pk1.connectWithGranuleCells(neurons);
    console.log(`Total connections made: ${totalConnections}`);
}

function draw(p5) {
    p5.background(255);
    pk1.render(p5);
    neurons.forEach((neuron) => neuron.render(p5));
    mf1.render(p5);
    mf2.render(p5);
    dcn1.render(p5);
    io1.render(p5);
    spikeManager.render(p5);
    periodicallyAddNewSpikes(counter, p5);
    // periodicallyAddNewSpikesToPurkinje(counter, p5);
    ++counter;
}

// function periodicallyAddNewSpikesToPurkinje(counter, p5) {
//     if (counter % randomInterval1 === 0) {
//         if (!pk1.dendrites) {
//             return;
//         }
//         spikeManager.addRandomSpikes(
//             {
//                 tree: pk1.dendrites.tree,
//                 direction: "inbound",
//                 n: 1,
//                 color: [0, 200, 200], // [200, 0, 200],
//             },
//             p5,
//         );
//         // randomInterval1 = getRandomInt(10, 80);
//     }
// }

// function periodicallyAddNewSpikesToGC(counter, p5) {
//     if (neurons.length < 5) {
//         return;
//     }
//     if (counter % randomInterval1 === 0) {
//         spikeManager.addSpike({
//                 branch: neurons[4].axon.tree.branches[0],
//                 direction: "outbound",
//                 color: [0, 200, 200], // [200, 0, 200],
//             },
//             p5,
//         );
//         randomInterval1 = getRandomInt(200, 500);
//     }
// }

function periodicallyAddNewSpikes(counter, p5) {
    let cnt = counter - 10; // adds slight delay before spiking starts
    if (cnt % randomInterval1 === 0) {
        for (const neuron of [mf1]) {
            if (!neuron.axon || !neuron.axon.tree) {
                continue;
            }
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
        randomInterval1 = getRandomInt(100, 500);
    }

    if (cnt % randomInterval2 === 0) {
        for (const neuron of [mf2]) {
            if (!neuron.axon || !neuron.axon.tree) {
                continue;
            }
            spikeManager.addRandomSpikes(
                {
                    tree: neuron.axon.tree,
                    direction: "outbound",
                    n: 1,
                    color: [0, 200, 200],
                },
                p5,
            );
        }
        randomInterval2 = getRandomInt(50, 100);
    }
}
