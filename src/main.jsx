import p5Lib from "p5";
import SpikeManager from "./spike-manager.js";
import GranuleCell from "./neurons/granule-cell.js";
import MossyFiberNeuron from "./neurons/mossy-fiber-neuron.js";
import PurkinjeNeuron from "./neurons/purkinje-neuron.js";
import { getRandomInt } from "./utils.js";
// import Branch from "./branch.js";
// import { Receptor } from "./synapses.js";

const neurons = [];
const spikeManager = new SpikeManager();
const screenW = document.documentElement.clientWidth - 30;
const screenH = document.documentElement.clientHeight - 20;
let counter = 0;
let randomInterval1 = 30;
let randomInterval2 = 50;
let mf1, mf2;
let pk1;

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
            y: (screenH * 2) / 3,
            width: getRandomInt(30, 50),
        });
        neurons.push(gc);
    }

    mf1 = new MossyFiberNeuron({
        x: 425,
        y: screenH + 200,
        width: 60,
    });

    mf2 = new MossyFiberNeuron({
        x: 175,
        y: screenH + 200,
        width: 60,
    });
    mf2.connectTo(neurons[0], getRandomInt(2, 3));
    mf2.connectTo(neurons[1], getRandomInt(2, 4));
    mf2.connectTo(neurons[2], getRandomInt(2, 4));

    pk1 = new PurkinjeNeuron({
        x: 1000,
        y: screenH - 100,
        width: 60,
        color: [200, 100, 100],
    });

    // order matters here: first make the connections, then generate all the dendrites,
    // then generate all the axon connections
    neurons.forEach((gc) => mf1.connectTo(gc, getRandomInt(1, 4)));
    neurons.forEach((gc) => gc.generateDendrites());
    mf1.generateDendrites();
    mf2.generateDendrites();
    await pk1.generateDendrites();

    let xOffset = 40;
    const shuffledNeurons = [...neurons].sort(() => Math.random() - 0.5);
    shuffledNeurons.forEach((gc) => {
        gc.generateAxon(10 + xOffset);
        xOffset += getRandomInt(15, 40);
    });
    mf1.generateAxon();
    mf2.generateAxon();
    pk1.generateAxon();

    // find Purkinje dendrite intersections with Granule Cell axons:
    // for (const gc of [neurons[0]]) {
    //     for (let gcBranch of gc.axon.tree.getAllBranches()) {
    //         const branchesToBeBisected =
    //             pk1.dendrites.tree.findIntersectionsWithExternalBranch(
    //                 gcBranch,
    //             );
    //         console.log(branchesToBeBisected);
    //         let i = 0;
    //         for (const entry of branchesToBeBisected) {
    //             const point = entry.intersectionPoint;
    //             const pkBranch = entry.branch;
    //             const terminal = gc.addTerminalToBranch(gcBranch, point);
    //             const receptor = pk1.addReceptorToBranch(pkBranch, point);

    //             // make the connections:
    //             receptor.setTerminal(terminal);
    //             terminal.setReceptor(receptor);
    //             ++i;
    //             // why does it work with 2 but not 3 terminal / receptor pairs?
    //             // and how do I debug this error?
    //             // if (i > 1) {
    //             //     break;
    //             // }
    //         }
    //     }
    //     console.log(gc.axon);
    // }
}

function draw(p5) {
    p5.background(255);
    neurons.forEach((neuron) => neuron.render(p5));
    mf1.render(p5);
    mf2.render(p5);
    pk1.render(p5);
    spikeManager.render(p5);
    // periodicallyAddNewSpikes(++counter, p5);
    periodicallyAddNewSpikesToPurkinje(counter, p5);
    ++counter;
}

function periodicallyAddNewSpikesToPurkinje(counter, p5) {
    if (counter % 3333333333333333 === 0) {
        spikeManager.addRandomSpikes(
            {
                tree: pk1.dendrites.tree,
                direction: "inbound",
                n: 1,
                color: [0, 200, 200], // [200, 0, 200],
            },
            p5,
        );
        randomInterval1 = getRandomInt(10, 80);
    }
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
        randomInterval2 = getRandomInt(40, 150);
    }
}
