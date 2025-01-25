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
import { getRandomFloat } from "./utils.js";

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
            //let rando = getRandomFloat(1, 1.005);
            // console.log(rando);
            // rando = 1; // comment this out if you want more random looking connections
            let y2 = (cell.y + 3 * cell.width); // * rando;

            // vertical line:
            p.line(
                this.mossyFiberNeuron.x,
                this.mossyFiberNeuron.y,
                this.mossyFiberNeuron.x,
                y2
            );
            for (const receptor of cell.receptors) {
                // horizontal line:
                let x2 =
                    ((cell.x - this.mossyFiberNeuron.x) / 5) * 4 +
                    this.mossyFiberNeuron.x;
                p.line(this.mossyFiberNeuron.x, y2 + cell.width, x2, y2);

                //vertical line
                p.line(x2, y2, receptor.x, receptor.y);
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
