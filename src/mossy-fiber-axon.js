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

export default class MossyFiberAxon {
    constructor(mossyFiberNeuron, granuleCellList, color = [44, 201, 255]) {
        this.mossyFiberNeuron = mossyFiberNeuron;
        this.granuleCellList = granuleCellList;
        this.color = color;
    }

    render(p) {
        p.strokeWeight(3);
        p.stroke(...this.color);
        const connectedCells = this.granuleCellList.getCells().filter((gc) => {
            return this.mossyFiberNeuron.connectsTo.includes(gc.id);
        });

        for (const cell of connectedCells) {
            const bounds = cell.layer.getBounds();
            let y2 = Math.min(bounds.y2, cell.y + 3 * cell.w);
            p.line(
                this.mossyFiberNeuron.x,
                this.mossyFiberNeuron.y,
                this.mossyFiberNeuron.x,
                y2
            );
            for (const receptor of cell.receptors) {
                p.line(this.mossyFiberNeuron.x, y2, receptor.x, y2)
                p.line(receptor.x, y2, receptor.x, receptor.y);
                p.ellipse(
                    receptor.x,
                    receptor.y + receptor.receptorLength / 4,
                    receptor.receptorLength,
                    receptor.receptorLength / 4
                );
            }
        }
    }
}
