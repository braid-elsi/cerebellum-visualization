import p5 from "p5";
import MossyFiberNeuron from "./mossy-fiber-neuron.js";

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

let signalPos = 0;
const neurons = [];

function setup(p) {
    p.createCanvas(800, 600);
    for (let i = 0; i < 10; i++) {
        neurons.push(
            new MossyFiberNeuron(p, 150 + i * 50, 550, 400, 450, Math.random())
        );
    }
}

function draw(p) {
    p.background(240);
    drawCircuit(p);
    for (const neuron of neurons) {
        if (neuron.signalPos > 1) {
            neuron.signalPos = 0;
        }
        p.stroke(255, 0, 0);
        p.fill(255, 0, 0);
        let x = p.lerp(neuron.x1, neuron.x2, neuron.signalPos);
        let y = p.lerp(neuron.y1, neuron.y2, neuron.signalPos);
        p.ellipse(x, y, 8, 8);
        neuron.signalPos += 0.01;
    }
}

function drawCircuit(p) {
    p.background(240);

    // Draw Purkinje cell body (soma)
    p.stroke(0, 100, 200);
    p.fill(0, 100, 200, 100);
    p.ellipse(400, 450, 60, 60); // Soma at the base of the tree

    // Draw Purkinje cell dendrites (tall branching structure)
    drawDendrites(p, 400, 450, 100, -90, 7); // Starting at soma

    for (const neuron of neurons) {
        neuron.render();
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
