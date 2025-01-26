/**
 * - Mossy fibers are axons that connect to granule cells' dendrites
 * - Each mossy fiber typically makes synaptic connections with hundreds to
 *   thousands of granule cells.
 * - A single mossy fiber input can contribute to the activity of a vast
 *   population of granule cells.
 * - A single neuron has one mossy fiber. However, that one mossy fiber
 *   branches extensively, allowing it to connect with many granule cells and other targets in the cerebellum.
 */

import Axon from "./axon.js";

export default class MossyFiberAxon extends Axon {
    constructor({ source, targetCells=[], axonWidth = 3 }) {
        super({
            source,
            targetCells,
            axonWidth,
        });
        this.generateSynapses();
    }

    generateSynapses() {
        this.generateGranuleSynapses();
        this.generateDCNSynapses();
    }

    generateGranuleSynapses() {
        const granuleCells = this.targetCells.filter(
            (cell) => cell.cellType === "gc"
        );
        for (const cell of granuleCells) {
            for (const receptor of cell.receptors) {
                const polyline = [];
                const mfX = this.source.x;
                const mfY = this.source.y;
                const y2 = cell.y + 3 * cell.width;

                // vertical line:
                polyline.push({
                    start: { x: mfX, y: mfY },
                    end: { x: mfX, y: y2 },
                });

                // angled line to cell:
                let x2 = ((cell.x - mfX) / 5) * 4 + mfX;
                polyline.push({
                    start: { x: mfX, y: y2 + cell.width },
                    end: { x: x2, y: y2 },
                });

                // angled line to receptor:
                polyline.push({
                    start: { x: x2, y: y2 },
                    end: {
                        x: receptor.x,
                        y: receptor.y + receptor.receptorLength / 2,
                    },
                });
                this.polylines.push(polyline);

                this.receptors.push({
                    x: receptor.x,
                    y: receptor.y + receptor.receptorLength / 2,
                    width: receptor.length / 2.3,
                    height: receptor.length / 9,
                });
            }
        }
    }

    generateDCNSynapses() {
        const dcnCells = this.targetCells.filter(
            (cell) => cell.cellType === "dcn"
        );
        for (const cell of dcnCells) {
            const polyline = [];
            const mfX = this.source.x;
            const mfY = this.source.y;
            polyline.push({
                start: { x: mfX, y: mfY },
                end: { x: mfX, y: cell.y },
            });

            // horizontal line:
            const xEnd = cell.x - cell.width / 2 - 5;
            polyline.push({
                start: { x: mfX, y: cell.y },
                end: { x: xEnd, y: cell.y },
            });

            this.polylines.push(polyline);

            this.receptors.push({
                x: xEnd,
                y: cell.y,
                width: this.axonWidth * 2,
                height: this.axonWidth * 4,
            });
        }
    }

}
