import GranuleDentriteReceptor from "./granule-cell-receptor";
import ParallelFiber from "./granule-cell-parallel-fiber";

export default class GranuleCell {
    constructor({
        id,
        x,
        y,
        w,
        layer,
        numReceptors = 4,
        color = [98, 104, 190],
        fiberWeight = 3,
    }) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.layer = layer;
        this.color = color;
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
                    this.w * 1.3,
                    this.w / 2,
                    this.color
                )
            );
        }
    }

    addParallelFiber(molecularLayer) {
        // console.log(molecularLayer.getBounds());
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
        p5.ellipse(this.x, this.y, this.w, this.w);
        this.receptors.forEach((receptor) => receptor.render(p5));

        if (this.parallelFiber) {
            this.parallelFiber.render(p5);
        }
    }
}
