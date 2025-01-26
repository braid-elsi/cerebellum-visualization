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
    constructor(mossyFiberNeuron, targetCells) {
        this.mossyFiberNeuron = mossyFiberNeuron;
        this.targetCells = targetCells;
    }

    render(p5) {
        const color = this.mossyFiberNeuron.getColor();
        p5.strokeWeight(3);
        p5.stroke(...color);

        this.renderGranuleConnections(p5);
        this.renderDCNConnection(p5);
    }

    renderGranuleConnections(p5) {
        const granuleCells = this.targetCells.filter(
            (cell) => cell.cellType === "gc"
        );
        for (const cell of granuleCells) {
            let y2 = cell.y + 3 * cell.width;

            // vertical line:
            p5.line(
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
                p5.line(this.mossyFiberNeuron.x, y2 + cell.width, x2, y2);

                //vertical line
                p5.line(x2, y2, receptor.x, receptor.y);
                p5.ellipse(
                    receptor.x,
                    receptor.y + receptor.receptorLength / 4,
                    receptor.receptorLength,
                    receptor.receptorLength / 4
                );
            }
        }
    }

    renderDCNConnection(p5) {
        const dcnCells = this.targetCells.filter(
            (cell) => cell.cellType === "dcn"
        );
        for (const cell of dcnCells) {
            // vertical line:
            p5.line(
                this.mossyFiberNeuron.x,
                this.mossyFiberNeuron.y,
                this.mossyFiberNeuron.x,
                cell.y
            );

            // horizontal line:
            const xEnd = cell.x - cell.width / 2 - 5;
            p5.line(this.mossyFiberNeuron.x, cell.y, xEnd, cell.y);

            p5.ellipse(xEnd, cell.y, 5, 12);
        }
    }
}
