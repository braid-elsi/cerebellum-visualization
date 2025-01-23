import p5Lib from "p5";
import MossyFiberNeuronList from "./mossy-fiber-neuron-list.js";
import GranuleCellList from "./granule-cell-list.js";
import GranuleCell from "./granule-cell.js";
import LayerList from "./layer-list.js";
import PurkinjeCell from "./purkinje-cell.js";
import InferiorOlive from "./inferior-olive.js";
import CerebellarNuclei from "./cerebellar-nuclei.js";
import { getRandomInt } from "./utils.js";

// Create a new p5 instance
(function initializeApp() {
    document
        .querySelector("body")
        .insertAdjacentHTML("beforeend", `<p class="loading">Loading...</p>`);

    // adding an artificial delay to wait for the Google font to load:
    setTimeout(function () {
        new p5Lib(function (p5) {
            p5.setup = () => setup(p5);
            p5.draw = () => draw(p5);
        });
        document.querySelector(".loading").style.display = "none";
    }, 500);
})();

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
    // p5.frameRate(5);

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

    const backgroundGranuleCells = getBackgroundGCs();
    mossyFiberNeuronList = new MossyFiberNeuronList(
        globals.layers.brainstemLayer,
        granuleCellList
    );

    inferiorOlive = new InferiorOlive(globals.layers.brainstemLayer);

    cerebellarNuclei = new CerebellarNuclei(globals.layers.whiteMatterLayer);

    purkinjeCell = new PurkinjeCell(globals);

    globals.backgroundCells = [...backgroundGranuleCells];
    const allCells = [
        ...granuleCellList.getCells(),
        ...mossyFiberNeuronList.getCells(),
        inferiorOlive,
        cerebellarNuclei,
        purkinjeCell,
    ];
    allCells.forEach((cell) => {
        globals.cellLookup[cell.id] = cell;
    });
    console.log(globals);
}

function initControls(p5) {
    document
        .querySelector("body")
        .insertAdjacentHTML(
            "beforeend",
            `<button id="pause-play">Play</button>`
        );
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
    // draw layers:
    drawLayers(p5);

    // background cells:
    drawBackgroundCells(p5);

    // active cells
    drawForegroundCells(p5);

    // mossyFiberNeuronList.render(p5);
    // granuleCellList.render(p5);
    // inferiorOlive.render(p5);
    // cerebellarNuclei.render(p5);

    // purkinjeCell.render(p5);

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

function drawLayers(p5) {
    globals.layers.render(p5);
}

function drawBackgroundCells(p5) {
    globals.backgroundCells.forEach((cell) => {
        cell.render(p5);
    });
}

function drawForegroundCells(p5) {
    const cells = Object.values(globals.cellLookup);
    cells.forEach((cell) => {
        cell.render(p5);
    });
}

function getBackgroundGCs() {
    const cells = [];
    const granuleBounds = globals.layers.granuleLayer.getBounds();
    [
        { color: [241, 241, 241], count: 100, minW: 10, maxW: 20 },
        { color: [226, 226, 243], count: 150, minW: 20, maxW: 25 },
        { color: [226, 226, 243], count: 100, minW: 25, maxW: 30 },
        { color: [212, 212, 237], count: 40, minW: 30, maxW: 35 },
    ].forEach((specs) => {
        const { color, count, minW, maxW } = specs;
        for (let i = 0; i < count; i++) {
            const w = getRandomInt(minW, maxW);
            let y = getRandomInt(granuleBounds.y1, granuleBounds.y2);
            y = Math.min(y, granuleBounds.y2 - 2 * w);
            y = Math.max(y, granuleBounds.y1 + w / 2);

            const gc = new GranuleCell({
                id: `gc${i}`,
                x: getRandomInt(granuleBounds.x1, granuleBounds.x2),
                y: y,
                layer: globals.layers.granuleLayer,
                w: w,
                color: color,
                fiberWeight: 1,
            });
            gc.addParallelFiber(globals.layers.molecularLayer);
            cells.push(gc);
        }
    });

    return cells;
}
