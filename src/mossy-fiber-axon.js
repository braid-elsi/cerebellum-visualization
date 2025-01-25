/**
 * - Mossy fibers are axons that connect to granule cells' dendrites
 * - Each mossy fiber typically makes synaptic connections with hundreds to
 *   thousands of granule cells.
 * - A single mossy fiber input can contribute to the activity of a vast
 *   population of granule cells.
 * - A single neuron has one mossy fiber. However, that one mossy fiber
 *   branches extensively, allowing it to connect with many granule cells and other targets in the cerebellum.
 */

export default class MossyFiberAxon {
    constructor(mossyFiberNeuron, granuleCellList) {
        this.mossyFiberNeuron = mossyFiberNeuron;
        this.granuleCellList = granuleCellList;
    }

    render(p) {
        const color = this.mossyFiberNeuron.getColor();
        p.strokeWeight(3);
        p.stroke(...color);
        const connectedCells = this.granuleCellList.getCells().filter((gc) => {
            return this.mossyFiberNeuron.connectsTo.includes(gc.id);
        });

        for (const cell of connectedCells) {
            let y2 = (cell.y + 3 * cell.width);

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
