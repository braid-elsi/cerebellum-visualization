import p5Lib from "p5";
import MossyFiberNeuronList from "./mossy-fiber-neuron-list.js";
import GranuleCellList from "./granule-cell-list.js";
import GranuleCell from "./granule-cell.js";
import LayerList from "./layer-list.js";
import PurkinjeCell from "./purkinje-cell.js";
import InferiorOlive from "./inferior-olive.js";
import CerebellarNuclei from "./cerebellar-nuclei.js";
import { getRandomInt, drawLabel } from "./utils.js";
import config from "./config.js";

// Create a new p5 instance
(function initializeApp() {
    new p5Lib(function (p5) {
        p5.setup = () => setup(p5);
        p5.draw = () => draw(p5);
        p5.mouseClicked = () => mouseClicked(p5);
        // this is a lame hack to handle the delay in the Google fonts loading.
        // when the app initializes, it redraws for 10ms and then stops so that when
        // Monteserrat loads, it appears on the screen. The timeout time is arbirary.
        setTimeout(function () {
            p5.noLoop();
        }, 500);
    });
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

    const backgroundGranuleCells = createBackgroundGCs();
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
    allCells.forEach((cell) => {
        if (cell.createConnections) {
            cell.createConnections(globals);
        }
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

function mouseClicked(p5) {
    const cells = Object.values(globals.cellLookup);
    cells.forEach((cell) => {
        // if the cell has an intersects method, check if there's an intersection:
        if ("intersects" in cell) {
            if (cell.intersects(p5.mouseX, p5.mouseY)) {
                console.log(cell.id, "Intersects!");
            }
        }
    });
}

function drawCircuit(p5) {
    // draw layers:
    drawLayers(p5);

    // draw background cells:
    drawBackgroundCells(p5);

    // draw active cells
    drawForegroundCells(p5);

    // draw connections
    drawConnections(p5);

    // draw labels:
    drawLabels(p5);
}

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

function drawConnections(p5) {
    const cells = Object.values(globals.cellLookup);
    cells.forEach((cell) => {
        if (cell.drawConnections) {
            cell.drawConnections(p5);
        }
    });
}

function drawLabels(p5) {
    const specs = [
        {
            label: config.granuleCells.label,
            layer: globals.layers.granuleLayer,
        },
        {
            label: config.mossyFiberCells.label,
            layer: globals.layers.brainstemLayer,
        },
        {
            label: config.inferiorOlive.label,
            layer: globals.layers.brainstemLayer,
        },
        {
            label: config.cerebellarNuclei.label,
            layer: globals.layers.whiteMatterLayer,
        },
        {
            label: config.purkinjeCell.label,
            layer: globals.layers.purkinjeLayer,
        },
    ];
    specs.forEach((spec) => {
        const { label, layer } = spec;
        drawLabel(p5, label, layer);
    });
    globals.layers.renderLabels(p5);
}

function createBackgroundGCs() {
    const cells = [];
    const granuleBounds = globals.layers.granuleLayer.getBounds();
    [
        { color: [241, 241, 241], count: 100, minW: 10, maxW: 20 },
        { color: [226, 226, 243], count: 150, minW: 20, maxW: 25 },
        { color: [226, 226, 243], count: 100, minW: 25, maxW: 30 },
        { color: [212, 212, 237], count: 40, minW: 30, maxW: 35 },
    ].forEach((spec) => {
        const { color, count, minW, maxW } = spec;
        for (let i = 0; i < count; i++) {
            const w = getRandomInt(minW, maxW);
            let y = getRandomInt(granuleBounds.y1, granuleBounds.y2);
            y = Math.min(y, granuleBounds.y2 - 2 * w);
            y = Math.max(y, granuleBounds.y1 + w / 2);

            const gc = new GranuleCell({
                id: `gc${i}`,
                cellType: "gc",
                x: getRandomInt(granuleBounds.x1, granuleBounds.x2),
                y: Math.random() * 0.8 + .1,
                layer: globals.layers.granuleLayer,
                width: w,
                height: w,
                layer: globals.layers.granuleLayer,
                color: color,
                fiberWeight: 1,
            });
            gc.addParallelFiber(globals.layers.molecularLayer);
            cells.push(gc);
        }
    });

    return cells;
}
