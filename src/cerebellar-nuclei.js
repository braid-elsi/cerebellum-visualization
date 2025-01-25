import Cell from "./cell.js";
import config from "./config.js";

export default class CerebellarNuclei extends Cell {
    constructor(whiteMatterLayer) {

        const { id, x, y, width, height, cellType, color } =
            config.cerebellarNuclei;
        super({
            id,
            x,
            y,
            height,
            width,
            cellType,
            color,
            layer: whiteMatterLayer,
        });

        let bounds = whiteMatterLayer.getBounds();
        let maxHeight = bounds.y2 - bounds.y1 - 10;

        // adjust height based on bounds of layer:
        this.height = Math.min(this.height, maxHeight);
        this.width = this.height * 1.8;
    }
}
