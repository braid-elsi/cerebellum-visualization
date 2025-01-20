import GranuleCell from "./granule-cell.js";
import config from "./config.js";

export default class GranuleCellList {
    gcs = [];
    constructor(granuleLayer, molecularLayer) {
        let { color, cellParams } = config.granuleCells;
        const granuleBounds = granuleLayer.getBounds();
        for (const props of cellParams) {
            let { id, x, y, width, numReceptors } = props;
            y =
                granuleBounds.y1 +
                y * (granuleBounds.y2 - granuleBounds.y1);

            const opts = {
                id: id,
                layer: granuleLayer,
                x: x,
                y: y,
                w: width,
                numReceptors: numReceptors,
                color: color,
            };
            const gc = new GranuleCell(opts);
            gc.addParallelFiber(molecularLayer);
            this.gcs.push(gc);
        }
    }

    getCells() {
        return this.gcs;
    }

    render(p5) {
        this.gcs.forEach((gc) => gc.render(p5));
    }
}
