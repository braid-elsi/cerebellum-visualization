export default class PurkinjeCellAxon {
    constructor({ source, target }) {
        this.source = source;
        this.target = target;
    }

    render(p5) {
        const color = this.source.getColor();
        const strokeW = 4;
        const receptorW = strokeW * 3;
        const receptorH = strokeW;
        const y2 = this.target.y - this.target.height / 2 - receptorH;

        p5.fill(...color);
        p5.stroke(...color);
        p5.strokeWeight(strokeW);
        p5.line(this.source.x, this.source.y, this.target.x, y2);
        p5.ellipse(this.target.x, y2, receptorW, receptorH);
    }
}
