import GranuleCell from "./granuleCell.js";

const gcConfig = {
    numCells: 5,
    distanceBetweenCells: 90,
    width: 30,
    minReceptors: 3,
    maxReceptors: 7,
    color: [98, 104, 190],
};

function getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default class GranuleCellList {
    cells = [];
    constructor(granuleLayer, molecularLayer) {
        const {
            width,
            distanceBetweenCells,
            color,
            minReceptors,
            maxReceptors,
            numCells,
        } = gcConfig;
        const granuleBounds = granuleLayer.getBounds();
        for (let i = 0; i < numCells; i++) {
            let offset = 100;
            const opts = {
                x: i * (width + distanceBetweenCells) + granuleBounds.x1 + offset,
                y: (granuleBounds.y2 - granuleBounds.y1) / 4 + granuleBounds.y1,
                w: width,
                numReceptors: getRandomInt(minReceptors, maxReceptors),
                color: color,
            }
            const gc = new GranuleCell(opts);
            gc.addParallelFiber(molecularLayer);
            this.cells.push(gc);
        }
    }

    getCells() {
        return this.cells;
    }

    render(p5) {
        this.cells.forEach((gc) => gc.render(p5));
    }
}
