import Neuron from "./neuron.js";

export default class CerebellarNuclei extends Neuron {
    constructor({ id, x, y, cellType, width, height, color, layer }) {
        super({ id, x, y, cellType, width, height, color, layer });

        let bounds = layer.getBounds();
        let maxHeight = bounds.bottom - bounds.top - 10;

        // adjust height based on bounds of layer:
        this.height = Math.min(this.height, maxHeight);
        this.width = this.height * 1.8;
    }
}
