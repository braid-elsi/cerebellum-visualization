import GranuleCell from "./granule-cell.js";
import config from "./config.js";

export default class GranuleCellList {
    gcs = [];
    constructor(granuleLayer, molecularLayer) {
        let { color, cellType, cellParams } = config.granuleCells;


        for (const props of cellParams) {
            let { id, x, y, width, height, numReceptors } = props;
            const opts = {
                id: id,
                cellType: cellType,
                layer: granuleLayer,
                x: x,
                y: y,
                width: width,
                height: height,
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

}
