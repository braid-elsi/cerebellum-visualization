import p5Lib from "p5";
import MossyFiberNeuron from "./mossy-fiber-neuron.js";
import GranuleCellList from "./granule-cell-list.js";
import LayerList from "./layer-list.js";

// Create a new p5 instance
new p5Lib(function (p5) {
    p5.setup = () => setup(p5);
    p5.draw = () => draw(p5);
});

// global variables:
const mfNeurons = [];
const granuleCells = [];
let granuleCellList;
let layerList;
let screenW;
let screenH;

function setup(p5) {
    // p5.frameRate(80);
    p5.noLoop();
    screenW = document.documentElement.clientWidth;
    screenH = document.documentElement.clientHeight;

    p5.createCanvas(screenW, screenH);

    layerList = new LayerList(screenW, screenH);

    // const granuleLayer = layerList.granuleLayer;
    // const mfLayer = layerList.brainstemLayer;
    // const granuleBounds = granuleLayer.getBounds();
    // const mfBounds = mfLayer.getBounds();

    granuleCellList = new GranuleCellList(
        layerList.granuleLayer,
        layerList.molecularLayer
    );

    // for (let i = 0; i < 6; i++) {
    //     let w = 30;
    //     let x = i * (w + 90) + granuleBounds.x1;
    //     let yGC = (granuleBounds.y2 - granuleBounds.y1) / 4 + granuleBounds.y1;
    //     let yMF = (mfBounds.y2 - mfBounds.y1) / 2 + mfBounds.y1;

    //     // create one granule cell and one mossy fiber cell for each iteration
    //     granuleCells.push(new GranuleCell(x, yGC, w, getRandomInt(3, 6)));
    //     mfNeurons.push(new MossyFiberNeuron(x, yMF, x, yGC, Math.random()));
    // }

    initControls(p5);
}

function initControls(p5) {
    const el = document.querySelector("#pause-play");
    el.addEventListener("click", () => {
        if (el.innerHTML === "Pause") {
            el.innerHTML = "Play";
            p5.noLoop();
        } else {
            el.innerHTML = "Pause";
            p5.loop();
        }
    });
}

function draw(p5) {
    p5.clear();
    // p5.background(240);

    layerList.render(p5);

    // the animation:
    for (const neuron of mfNeurons) {
        if (neuron.signalPos > 1) {
            neuron.signalPos = 0;
        }
        p5.stroke(254, 82, 0);
        p5.fill(254, 82, 0);
        let x = p5.lerp(neuron.x1, neuron.x2, neuron.signalPos);
        let y = p5.lerp(neuron.y1, neuron.y2, neuron.signalPos);
        p5.ellipse(x, y, 12, 12);
        neuron.signalPos += 0.015;
    }

    drawCircuit(p5);
}

function drawCircuit(p5) {
    // p5.background(240);

    // Draw layers:
    // layerList.render(p5);

    // // Draw Purkinje cell body (soma)
    // p5.stroke(0, 100, 200);
    // p5.fill(0, 100, 200, 100);
    // p5.ellipse(400, 450, 60, 60); // Soma at the base of the tree

    // // Draw Purkinje cell dendrites (tall branching structure)
    // drawDendrites(p, 400, 450, 100, -90, 7); // Starting at soma

    // for (const neuron of mfNeurons) {
    //     neuron.render(p5);
    // }

    // for (const neuron of granuleCells) {
    //     neuron.render(p5);
    // }

    granuleCellList.render(p5);

    // Draw climbing fiber wrapping around dendrites
    // stroke(255, 150, 0);
    // strokeWeight(2);
    // drawClimbingFiber(p, 400, 450, 100, -200, 5); // Climbing fiber wrapping dendrites
}

function drawDendrites(p, x, y, length, angle, depth) {
    if (depth === 0) return;

    // Calculate the end point of the branch
    let x2 = x + length * p5.cos(p5.radians(angle));
    let y2 = y + length * p5.sin(p5.radians(angle));

    // Draw the branch
    p5.stroke(0, 100, 200);
    p5.strokeWeight(depth);
    p5.line(x, y, x2, y2);

    // Recursively draw smaller branches
    drawDendrites(p, x2, y2, length * 0.7, angle - 30, depth - 1);
    drawDendrites(p, x2, y2, length * 0.7, angle + 30, depth - 1);
}

function drawClimbingFiber(p, x, y, length, angle, depth) {
    // return;
    if (depth === 0) return;

    // Calculate the end point of the climbing fiber
    let x2 = x + length * p5.cos(p5.radians(angle));
    let y2 = y + length * p5.sin(p5.radians(angle));

    // Draw the climbing fiber wrapping around
    p5.stroke(255, 150, 0);
    p5.strokeWeight(1.5);
    p5.line(x - 5, y, x2 - 5, y2); // Slight offset for wrapping effect
    p5.line(x + 5, y, x2 + 5, y2);

    // Recursively wrap around the dendrites
    drawClimbingFiber(x2, y2, length * 0.7, angle - 30, depth - 1);
    drawClimbingFiber(x2, y2, length * 0.7, angle + 30, depth - 1);
}
