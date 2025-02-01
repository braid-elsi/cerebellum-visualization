export default class Receptor {
    constructor({ neuron, angle, length, receptorLength }) {
        this.neuron = neuron;
        this.xStart = neuron.x;
        this.yStart = neuron.y;
        this.x = neuron.x + length * Math.cos(angle);
        this.y = neuron.y + length * Math.sin(angle);
        this.angle = angle;
        this.length = length;
        this.receptorLength = receptorLength;
    }

    render(p5) {
        const color = this.neuron.getColor();
        console.log("receptor color:", color);
        p5.strokeWeight(3);
        p5.stroke(...color);
        p5.fill(...color);
        console.log(this.xStart, this.yStart, this.x, this.y);
        p5.line(this.xStart, this.yStart, this.x, this.y);
        p5.ellipse(
            this.x,
            this.y,
            this.receptorLength,
            this.receptorLength / 4
        );
    }
}
