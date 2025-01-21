import GranuleCell from "./granule-cell.js";
import config from "./config.js";
import { drawLabel, getYPositionAbs } from "./utils.js";

export default class GranuleCellList {
    gcs = [];
    constructor(granuleLayer, molecularLayer) {
        let { color, cellParams, label } = config.granuleCells;

        this.label = label;
        this.layer = granuleLayer;

        for (const props of cellParams) {
            let { id, x, y, width, numReceptors } = props;
            const opts = {
                id: id,
                layer: granuleLayer,
                x: x,
                y: getYPositionAbs(y, this.layer),
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
        drawLabel(p5, this.label, this.layer);
    }
}
