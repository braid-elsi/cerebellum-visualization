function getRandomInt(a, b) {
    return Math.floor(Math.random() * (b - a + 1)) + a;
}

export default class ParallelFiber {
    // this is the parallel fiber:
    constructor(gc, molecularLayer, color = [98, 104, 190]) {
        this.gc = gc;
        this.molecularLayer = molecularLayer;
        this.color = color;
        this.bounds = this.molecularLayer.getBounds();
        this.yEnd = getRandomInt(this.bounds.y1 + 5, this.bounds.y2 - 5);
    
    }

    render(p5) {
        
        p5.strokeWeight(3);
        p5.stroke(...this.color);
        p5.fill(...this.color);
        p5.line(this.gc.x, this.gc.y, this.gc.x, this.yEnd);
        p5.line(this.bounds.x1, this.yEnd, this.bounds.x2, this.yEnd);
    }
}
