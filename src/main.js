import p5Lib from "p5";
import MossyFiberNeuronList from "./mossy-fiber-neuron-list.js";
import GranuleCellList from "./granule-cell-list.js";
import LayerList from "./layer-list.js";
import PurkinjeCell from "./purkinje-cell.js";
import InferiorOlive from "./inferior-olive.js";
import CerebellarNuclei from "./cerebellar-nuclei.js";

// Create a new p5 instance
new p5Lib(function (p5) {
    p5.setup = () => setup(p5);
    p5.draw = () => draw(p5);
});

// global variables:
const mfNeurons = [];
let granuleCellList;
let mossyFiberNeuronList;
let purkinjeCell;
let inferiorOlive;
let cerebellarNuclei;
let screenW;
let screenH;
const globals = {
    cellLookup: {},
    layers: {},
};

function setup(p5) {
    p5.frameRate(5);

    // screen initialization:
    p5.noLoop();
    screenW = document.documentElement.clientWidth;
    screenH = document.documentElement.clientHeight * 1.5;
    p5.createCanvas(screenW, screenH);
    initControls(p5);

    // initialize neurons and layers:
    globals.layers = new LayerList(screenW, screenH);

    granuleCellList = new GranuleCellList(
        globals.layers.granuleLayer,
        globals.layers.molecularLayer
    );
    mossyFiberNeuronList = new MossyFiberNeuronList(
        globals.layers.brainstemLayer,
        granuleCellList
    );

    inferiorOlive = new InferiorOlive(globals.layers.brainstemLayer);

    cerebellarNuclei = new CerebellarNuclei(globals.layers.whiteMatterLayer);

    purkinjeCell = new PurkinjeCell(globals);

    const allCells = [
        ...granuleCellList.getCells(),
        ...mossyFiberNeuronList.getCells(),
        inferiorOlive,
        cerebellarNuclei,
        purkinjeCell,
    ];
    console.log(allCells);
    allCells.forEach((cell) => {
        globals.cellLookup[cell.id] = cell;
    });
    console.log(globals);
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

    globals.layers.render(p5);

    // the animation:
    // for (const neuron of mfNeurons) {
    //     if (neuron.signalPos > 1) {
    //         neuron.signalPos = 0;
    //     }
    //     p5.stroke(254, 82, 0);
    //     p5.fill(254, 82, 0);
    //     let x = p5.lerp(neuron.x1, neuron.x2, neuron.signalPos);
    //     let y = p5.lerp(neuron.y1, neuron.y2, neuron.signalPos);
    //     p5.ellipse(x, y, 12, 12);
    //     neuron.signalPos += 0.015;
    // }

    drawCircuit(p5);
}

function drawCircuit(p5) {
    // const cells = Object.values(globals.cellLookup);
    // console.log(cells);
    // cells.forEach((cell) => {
    //     console.log("rendering...", cell);
    //     cell.render(p5);
    // });
    mossyFiberNeuronList.render(p5);
    granuleCellList.render(p5);
    inferiorOlive.render(p5);
    cerebellarNuclei.render(p5);

    purkinjeCell.render(p5);

    // Draw climbing fiber wrapping around dendrites
    // stroke(255, 150, 0);
    // strokeWeight(2);
    // drawClimbingFiber(p, 400, 450, 100, -200, 5); // Climbing fiber wrapping dendrites
}

// function drawDendrites(p, x, y, length, angle, depth) {
//     if (depth === 0) return;

//     // Calculate the end point of the branch
//     let x2 = x + length * p5.cos(p5.radians(angle));
//     let y2 = y + length * p5.sin(p5.radians(angle));

//     // Draw the branch
//     p5.stroke(0, 100, 200);
//     p5.strokeWeight(depth);
//     p5.line(x, y, x2, y2);

//     // Recursively draw smaller branches
//     drawDendrites(p, x2, y2, length * 0.7, angle - 30, depth - 1);
//     drawDendrites(p, x2, y2, length * 0.7, angle + 30, depth - 1);
// }

// function drawClimbingFiber(p, x, y, length, angle, depth) {
//     // return;
//     if (depth === 0) return;

//     // Calculate the end point of the climbing fiber
//     let x2 = x + length * p5.cos(p5.radians(angle));
//     let y2 = y + length * p5.sin(p5.radians(angle));

//     // Draw the climbing fiber wrapping around
//     p5.stroke(255, 150, 0);
//     p5.strokeWeight(1.5);
//     p5.line(x - 5, y, x2 - 5, y2); // Slight offset for wrapping effect
//     p5.line(x + 5, y, x2 + 5, y2);

//     // Recursively wrap around the dendrites
//     drawClimbingFiber(x2, y2, length * 0.7, angle - 30, depth - 1);
//     drawClimbingFiber(x2, y2, length * 0.7, angle + 30, depth - 1);
// }
