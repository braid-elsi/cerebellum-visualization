function getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default class ParallelFiber {
    // this is the parallel fiber:
    constructor({
        granuleCell,
        layer,
        color = [98, 104, 190],
        fiberWeight = 3,
    }) {
        this.gc = granuleCell;
        this.molecularLayer = layer;
        this.color = color;
        this.fiberWeight = fiberWeight;
        this.bounds = this.molecularLayer.getBounds();
        this.yEnd = getRandomInt(this.bounds.y1 + 5, this.bounds.y2 - 5);
    }

    render(p5) {
        p5.strokeWeight(this.fiberWeight);
        p5.stroke(...this.color);
        p5.fill(...this.color);
        //vertical line:
        p5.line(this.gc.x, this.gc.y, this.gc.x, this.yEnd);
        const tSize = this.fiberWeight * 3;
        const topLeft = [this.gc.x - tSize, this.yEnd];
        const topRight = [this.gc.x + tSize, this.yEnd];
        const bottom = [this.gc.x, this.yEnd + tSize * Math.sqrt(2)];
        p5.triangle(...topLeft, ...topRight, ...bottom);
        p5.line(this.bounds.x1, this.yEnd, this.bounds.x2, this.yEnd);
    }
}
