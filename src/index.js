import p5 from "p5";
import MossyFiberNeuron from "./mossy-fiber-neuron.js";
import Neuron from "./neuron.js";
import LayerList from "./layerList.js";

const mfNeurons = [];
const granuleCells = [];
let layerList;
let screenW;
let screenH;
let canvas;

// Create a new p5 instance
const sketch = (p) => {
    p.setup = () => {
        setup(p);
    };

    p.draw = () => {
        draw(p);
    };
};
new p5(sketch);

function setup(p) {
    // p.frameRate(80);
    screenW = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
    );
    screenH = Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
    );
    canvas = p.createCanvas(screenW, screenH);

    layerList = new LayerList(screenW, screenH);

    const granuleLayer = layerList.granuleLayer;
    const mfLayer = layerList.brainstemLayer;
    const granuleBounds = granuleLayer.getBounds();
    const mfBounds = mfLayer.getBounds();

    for (let i = 0; i < 20; i++) {
        let w = 40;
        let x = i * (w + 20) + granuleBounds.x1;
        let yGC = (granuleBounds.y2 - granuleBounds.y1) / 2 + granuleBounds.y1;
        let yMF = (mfBounds.y2 - mfBounds.y1) / 2 + mfBounds.y1;

        // create one granule cell and one mossy fiber cell for each iteration
        granuleCells.push(new Neuron(x, yGC, w, [98, 104, 190]));
        mfNeurons.push(new MossyFiberNeuron(x, yMF, x, yGC, Math.random()));
    }
}

function draw(p) {
    p.clear();
    // p.background(240);

    layerList.render(p);

    // the animation:
    for (const neuron of mfNeurons) {
        if (neuron.signalPos > 1) {
            neuron.signalPos = 0;
        }
        p.stroke(254, 82, 0);
        p.fill(254, 82, 0);
        let x = p.lerp(neuron.x1, neuron.x2, neuron.signalPos);
        let y = p.lerp(neuron.y1, neuron.y2, neuron.signalPos);
        p.ellipse(x, y, 12, 12);
        neuron.signalPos += 0.015;
    }

    drawCircuit(p);
}

function drawCircuit(p) {
    // p.background(240);

    // Draw layers:
    // layerList.render(p);

    // // Draw Purkinje cell body (soma)
    // p.stroke(0, 100, 200);
    // p.fill(0, 100, 200, 100);
    // p.ellipse(400, 450, 60, 60); // Soma at the base of the tree

    // // Draw Purkinje cell dendrites (tall branching structure)
    // drawDendrites(p, 400, 450, 100, -90, 7); // Starting at soma

    for (const neuron of mfNeurons) {
        neuron.render(p);
    }

    for (const neuron of granuleCells) {
        neuron.render(p);
    }

    // Draw climbing fiber wrapping around dendrites
    // stroke(255, 150, 0);
    // strokeWeight(2);
    // drawClimbingFiber(p, 400, 450, 100, -200, 5); // Climbing fiber wrapping dendrites
}

function drawDendrites(p, x, y, length, angle, depth) {
    if (depth === 0) return;

    // Calculate the end point of the branch
    let x2 = x + length * p.cos(p.radians(angle));
    let y2 = y + length * p.sin(p.radians(angle));

    // Draw the branch
    p.stroke(0, 100, 200);
    p.strokeWeight(depth);
    p.line(x, y, x2, y2);

    // Recursively draw smaller branches
    drawDendrites(p, x2, y2, length * 0.7, angle - 30, depth - 1);
    drawDendrites(p, x2, y2, length * 0.7, angle + 30, depth - 1);
}

function drawClimbingFiber(p, x, y, length, angle, depth) {
    // return;
    if (depth === 0) return;

    // Calculate the end point of the climbing fiber
    let x2 = x + length * p.cos(p.radians(angle));
    let y2 = y + length * p.sin(p.radians(angle));

    // Draw the climbing fiber wrapping around
    p.stroke(255, 150, 0);
    p.strokeWeight(1.5);
    p.line(x - 5, y, x2 - 5, y2); // Slight offset for wrapping effect
    p.line(x + 5, y, x2 + 5, y2);

    // Recursively wrap around the dendrites
    drawClimbingFiber(x2, y2, length * 0.7, angle - 30, depth - 1);
    drawClimbingFiber(x2, y2, length * 0.7, angle + 30, depth - 1);
}
