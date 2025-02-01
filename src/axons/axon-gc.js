import { getRandomInt } from "../neurons/utils.js";
import Axon from "./axon.js";

// The Granule Cell Axon is the same thing as the parallel fiber:
export default class GranuleCellAxon extends Axon {
    // this is the parallel fiber:
    constructor({ source, molecularLayer, targetCells = [], axonWidth = 3 }) {
        super({
            source,
            targetCells,
            axonWidth,
        });

        this.molecularLayer = molecularLayer;
        this.bounds = this.molecularLayer.getBounds();
        this.yEnd = getRandomInt(this.bounds.top + 5, this.bounds.bottom - 5);

        this.generateSynapses();
    }

    generateSynapses() {
        const polyline = [];
        polyline.push({
            start: { x: this.source.x, y: this.source.y },
            end: { x: this.source.x, y: this.yEnd },
        });
        polyline.push({
            start: { x: this.bounds.left, y: this.yEnd },
            end: { x: this.bounds.right, y: this.yEnd },
        });
        this.polylines.push(polyline);
    }

    render(p5) {
        // render lines and terminals:
        super.render(p5);

        // add extra triangle to make connections more clear:
        const tSize = this.axonWidth * 3;
        const topLeft = [this.source.x - tSize, this.yEnd];
        const topRight = [this.source.x + tSize, this.yEnd];
        const bottom = [this.source.x, this.yEnd + tSize * Math.sqrt(2)];
        p5.triangle(...topLeft, ...topRight, ...bottom);
    }
}
