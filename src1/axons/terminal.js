/**
 * Currently not used. Need to
 */
export default class Terminal {
    constructor({ neuron, angle, length, terminalLength }) {
        this.xStart = neuron.x;
        this.yStart = neuron.y;
        this.x = neuron.x + length * Math.cos(angle);
        this.y = neuron.y + length * Math.sin(angle);
        this.angle = angle;
        this.length = length;
        this.terminalLength = terminalLength;
    }

    render(p5) {
        const color = this.neuron.getColor();
        p5.stroke(...color);
        p5.fill(...color);
        p5.line(this.xStart, this.yStart, this.x, this.y);
        p5.ellipse(
            this.x,
            this.y,
            this.terminalLength,
            this.terminalLength / 4,
        );
    }
}
