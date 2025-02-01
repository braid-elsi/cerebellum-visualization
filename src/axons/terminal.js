/**
 * Currently not used. Need to
 */
export default class Terminal {
    constructor({ x, y, angle, length, terminalLength, color }) {
        this.xStart = x;
        this.yStart = y;
        this.x = x + length * Math.cos(angle);
        this.y = y + length * Math.sin(angle);
        this.angle = angle;
        this.length = length;
        this.terminalLength = terminalLength;
        this.color = color;
    }

    render(p5) {
        p5.stroke(...this.color);
        p5.fill(...this.color);
        p5.line(this.xStart, this.yStart, this.x, this.y);
        p5.ellipse(
            this.x,
            this.y,
            this.terminalLength,
            this.terminalLength / 4,
        );
    }
}
