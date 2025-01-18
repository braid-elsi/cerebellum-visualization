/**
 * - Mossy fibers are axons that connect to granule cells' dendrites
 * - Each mossy fiber typically makes synaptic connections with hundreds to
 *   thousands of granule cells.
 * - A single mossy fiber input can contribute to the activity of a vast
 *   population of granule cells.
 * - A single neuron has one mossy fiber. However, that one mossy fiber
 *   branches extensively, allowing it to connect with many granule cells and other targets in the cerebellum.
 */

import Pulse from "./pulse.js";

export default class Axon {
    constructor(x1, y1, x2, y2, color = [255, 150, 0]) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        this.pulse = new Pulse(x1, y1, x2, y2, color);
    }

    render(p) {
        p.stroke(...this.color);
        p.strokeWeight(1);
        p.line(this.x1, this.y1, this.x2, this.y2);
    }
}
