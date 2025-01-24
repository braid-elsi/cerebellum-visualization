export default class PurkinjeCellDendrite {
    constructor({ cell, target, color }) {
        console.log("purkinje:", cell);
        console.log("nuclei:", target);
        this.cell = cell;
        this.target = target;
        this.color = color;
    }

    render(p5) {
        p5.fill(...this.color);
        p5.stroke(...this.color);
        p5.strokeWeight(4);
        const y2 = this.target.yAbs - this.target.height / 2;
        p5.line(this.cell.x, this.cell.y, this.target.x, y2);
        p5.ellipse(this.target.x, y2, 20, 20);
    }
}
