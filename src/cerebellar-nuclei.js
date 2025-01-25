import Cell from "./cell.js";

export default class CerebellarNuclei extends Cell {
    constructor({ id, x, y, cellType, width, height, color, layer }) {
        super({ id, x, y, cellType, width, height, color, layer });

        let bounds = layer.getBounds();
        let maxHeight = bounds.y2 - bounds.y1 - 10;

        // adjust height based on bounds of layer:
        this.height = Math.min(this.height, maxHeight);
        this.width = this.height * 1.8;
    }
}
