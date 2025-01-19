import GranuleCell from "./granule-cell.js";
import config from "./config.js";

function getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default class GranuleCellList {
    cells = [];
    constructor(granuleLayer, molecularLayer) {
        let {
            minWidth,
            maxWidth,
            distanceBetweenCells,
            color,
            minReceptors,
            maxReceptors,
            numCells,
        } = config.granuleCells;
        const granuleBounds = granuleLayer.getBounds();
        for (let i = 0; i < numCells; i++) {
            const width = getRandomInt(minWidth, maxWidth);
            let offset = 100;
            let x =
                i * (width + distanceBetweenCells) + granuleBounds.x1 + offset;
            let y =
                (granuleBounds.y2 - granuleBounds.y1) / 4 + granuleBounds.y1;
            // let xRandom = getRandomInt(
            //     granuleBounds.x1 + width,
            //     granuleBounds.x2 - (width * 3) / 2
            // );
            let yRandom = getRandomInt(
                granuleBounds.y1 + width,
                granuleBounds.y2 - (width * 3) / 2
            );
            const opts = {
                x: x,
                y: yRandom,
                w: width,
                numReceptors: getRandomInt(minReceptors, maxReceptors),
                color: color,
            };
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
