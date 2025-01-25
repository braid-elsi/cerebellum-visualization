import Cell from "./cell.js";
import GranuleDentriteReceptor from "./granule-cell-receptor";
import ParallelFiber from "./granule-cell-parallel-fiber";

export default class GranuleCell extends Cell {
    constructor({
        id,
        cellType,
        x,
        y,
        width,
        height,
        layer,
        numReceptors = 4,
        color = [98, 104, 190],
        fiberWeight = 3,
    }) {
        // Cell constructor:
        super({ id, x, y, height, width, cellType, color, layer });

        // Additional Logic:
        this.receptors = [];
        this.fiberWeight = fiberWeight;

        let start = (7 / 8) * Math.PI;
        let end = (1 / 8) * Math.PI;
        let interval = Math.abs(start - end) / (numReceptors - 1);
        // console.log(interval);

        for (let i = 0; i < numReceptors; i++) {
            this.receptors.push(
                new GranuleDentriteReceptor(
                    this,
                    (7 / 8) * Math.PI - i * interval,
                    this.width * 1.3,
                    this.height / 2,
                    this.color
                )
            );
        }
    }

    addParallelFiber(molecularLayer) {
        this.parallelFiber = new ParallelFiber({
            granuleCell: this,
            layer: molecularLayer,
            color: this.color,
            fiberWeight: this.fiberWeight,
        });
    }

    render(p5) {
        p5.strokeWeight(this.fiberWeight);
        p5.stroke(...this.color);
        p5.fill(...this.color);
        p5.ellipse(this.x, this.y, this.width, this.height);
        this.receptors.forEach((receptor) => receptor.render(p5));

        if (this.parallelFiber) {
            this.parallelFiber.render(p5);
        }
    }
}
