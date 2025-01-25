export default class PurkinjeCellAxon {
    constructor({ source, target, color }) {
        this.source = source;
        this.target = target;
        this.color = color;
    }

    render(p5) {
        const strokeW = 4;
        const receptorW = strokeW * 3;
        const receptorH = strokeW;
        const y2 = this.target.yAbs - this.target.height / 2 - receptorH;

        p5.fill(...this.color);
        p5.stroke(...this.color);
        p5.strokeWeight(strokeW);
        p5.line(this.source.x, this.source.y, this.target.x, y2);
        p5.ellipse(this.target.x, y2, receptorW, receptorH);
    }
}
