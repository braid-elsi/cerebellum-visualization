// react stuff:
import React from "react";
import ReactDOM from "react-dom/client";
import InfoSlider from "./components/InfoSlider.jsx";

// p5 neuron stuff:
import p5Lib from "p5";
import MossyFiberNeuronList from "./list-neuron-mf.js";
import GranuleCellList from "./list-neuron-gc.js";
import GranuleCell from "./neurons/granule-cell.js";
import LayerList from "./list-layer.js";
import PurkinjeCell from "./neurons/purkinje.js";
import InferiorOlive from "./neurons/inferior-olive.js";
import CerebellarNuclei from "./neurons/cerebellar-nuclei.js";
import { getRandomInt, drawLabel } from "./neurons/utils.js";
import Pulse from "./pulses/pulse.js";
import config from "./config.js";

// Create a new p5 instance
(function initializeApp() {
    new p5Lib(function (p5) {
        p5.frameRate(40);
        p5.noLoop();
        p5.setup = () => setup(p5);
        p5.draw = () => draw(p5);
        p5.preload = () => preload(p5);
        p5.mouseClicked = () => mouseClicked(p5);
        // p5.mouseMoved = () => mouseMoved(p5);
        // this is a lame hack to handle the delay in the Google fonts loading.
        // when the app initializes, it redraws for 10ms and then stops so that when
        // Monteserrat loads, it appears on the screen. The timeout time is arbirary.
        // setTimeout(function () {
        //     p5.noLoop();
        // }, 500);
    });
})();

// react global variables:
let reactRoot = null;
let showComponent = false;

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
    pulses: [],
    fonts: {},
};
window.globals = globals;

function setup(p5) {
    console.log("setup starting...");
    // screen initialization:
    screenW = document.documentElement.clientWidth;
    screenH = Math.max(document.documentElement.clientHeight * 1.5, 1000);
    p5.createCanvas(screenW, screenH);
    initControls(p5);

    // initialize neurons and layers:
    globals.layers = new LayerList({
        screenW,
        screenH,
        fontFamily: globals.fonts.montserratMedium,
    });

    granuleCellList = new GranuleCellList(
        globals.layers.granuleLayer,
        globals.layers.molecularLayer,
    );

    const backgroundGranuleCells = createBackgroundGCs();
    const backgroundDCNs = createBackgroundDCNs();
    mossyFiberNeuronList = new MossyFiberNeuronList(
        globals.layers.brainstemLayer,
    );

    inferiorOlive = new InferiorOlive(globals.layers.brainstemLayer);

    const { id, x, y, width, height, cellType, color } =
        config.cerebellarNuclei;
    cerebellarNuclei = new CerebellarNuclei({
        id,
        x,
        y,
        width,
        height,
        cellType,
        color,
        layer: globals.layers.whiteMatterLayer,
    });

    purkinjeCell = new PurkinjeCell(globals);

    globals.backgroundCells = [...backgroundGranuleCells, ...backgroundDCNs];
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
        if ("createConnections" in cell) {
            cell.createConnections(globals);
        }
    });

    // for (const cell of mossyFiberNeuronList.getCells()) {
    for (const cell of allCells) {
        const pulse = new Pulse({ neuron: cell });
        globals.pulses.push(pulse);
    }
    // const gc1 = granuleCellList.getCells()[0];
    // console.log(gc1);
}

function initControls(p5) {
    document
        .querySelector("body")
        .insertAdjacentHTML(
            "beforeend",
            `<button id="pause-play">Play</button>`,
        );
    const el = document.querySelector("#pause-play");
    el.addEventListener("click", (ev) => {
        if (el.innerHTML === "Pause") {
            el.innerHTML = "Play";
            p5.noLoop();
        } else {
            el.innerHTML = "Pause";
            p5.loop();
        }
        ev.stopPropagation(); // don't interact with underlying canvas
    });
}

function draw(p5) {
    p5.clear();

    drawCircuit(p5);
}

function preload(p5) {
    const prefix = "./css/fonts/Montserrat";
    globals.fonts.montserrat = p5.loadFont(`${prefix}-Regular.ttf`);
    globals.fonts.montserratMedium = p5.loadFont(`${prefix}-Medium.ttf`);
    globals.fonts.montserratSemiBold = p5.loadFont(`${prefix}-SemiBold.ttf`);
    console.log("preload complete");
}

function drawCircuit(p5, advance = true) {
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

    // draw pulses:
    if (p5.isLooping()) {
        for (const pulse of globals.pulses) {
            pulse.render(p5, advance);
        }
    }
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
        drawLabel(p5, label, layer, globals.fonts.montserratMedium);
    });
    globals.layers.renderLabels(p5);
}

function createBackgroundDCNs() {
    const cells = [];
    const layer = globals.layers.whiteMatterLayer;
    [
        { color: [250, 241, 239], count: 30, minW: 10, maxW: 20 },
        { color: [245, 228, 234], count: 10, minW: 20, maxW: 25 },
        { color: [245, 228, 234], count: 5, minW: 25, maxW: 35 }, //[240, 215, 209]
    ].forEach((spec) => {
        const { color, count, minW, maxW } = spec;
        for (let i = 0; i < count; i++) {
            const w = getRandomInt(minW, maxW);

            const dcn = new CerebellarNuclei({
                id: `dcn${i}`,
                cellType: "dcn",
                x: getRandomInt(0, screenW),
                y: Math.random() * 0.85 + 0.04,
                layer: layer,
                width: w,
                height: w,
                color: color,
            });
            cells.push(dcn);
        }
    });

    return cells;
}

function createBackgroundGCs() {
    const cells = [];
    const layer = globals.layers.granuleLayer;
    [
        { color: [241, 241, 241], count: 100, minW: 10, maxW: 20 },
        { color: [226, 226, 243], count: 150, minW: 20, maxW: 25 },
        { color: [226, 226, 243], count: 100, minW: 25, maxW: 30 },
        { color: [212, 212, 237], count: 40, minW: 30, maxW: 35 },
    ].forEach((spec) => {
        const { color, count, minW, maxW } = spec;
        for (let i = 0; i < count; i++) {
            const w = getRandomInt(minW, maxW);

            const gc = new GranuleCell({
                id: `gc${i}`,
                cellType: "gc",
                x: getRandomInt(0, screenW),
                y: Math.random() * 0.85 + 0.04,
                layer: layer,
                width: w,
                height: w,
                color: color,
                axonWidth: 1,
            });
            gc.addAxon(globals.layers.molecularLayer);
            cells.push(gc);
        }
    });

    return cells;
}

// function mouseMoved(p5) {
//     select(p5);
// }

function mouseClicked(p5) {
    select(p5, false);
}

function select(p5) {
    const cells = Object.values(globals.cellLookup);
    let selectedCell = null;
    for (const cell of cells) {
        if ("intersects" in cell) {
            if (cell.intersects(p5.mouseX, p5.mouseY)) {
                cell.isActive = true;
                selectedCell = cell;
            } else {
                cell.isActive = false;
            }
        }
    }
    p5.clear();
    drawCircuit(p5, false);
    if (selectedCell && !globals.isDrawerOpen) {
        showInfo({ neuron: selectedCell });
    }
}

// React stuff:
function showInfo({ neuron }) {
    if (!reactRoot) {
        reactRoot = ReactDOM.createRoot(
            document.body.appendChild(document.createElement("div")),
        );
    }

    // Hack to get the Drawer to open each time:
    // 1. Set the slider to hidden:
    reactRoot.render(<InfoSlider neuron={neuron} isOpen={false} />);
    globals.isDrawerOpen = false;

    // 2. Trigger the Drawer to open after a 10ms delay
    setTimeout(() => {
        globals.isDrawerOpen = true;
        reactRoot.render(
            <InfoSlider neuron={neuron} isOpen={true} globals={globals} />,
        );
    }, 10);
}
