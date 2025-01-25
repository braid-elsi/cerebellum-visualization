import Cell from "./cell.js";
import config from "./config.js";

export default class InferiorOlive extends Cell {
    constructor(brainstemLayer) {
        const { id, x, y, width, height, cellType, color } =
            config.inferiorOlive;
        super({
            id,
            x,
            y,
            height,
            width,
            cellType,
            color,
            layer: brainstemLayer,
        });

        // minor customizations:
        let bounds = brainstemLayer.getBounds();
        let maxHeight = bounds.y2 - bounds.y1 - 10;
        this.height = Math.min(height, maxHeight);
        this.width = this.height * 1.6;
    }
}
