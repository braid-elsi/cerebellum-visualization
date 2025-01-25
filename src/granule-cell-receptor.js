// import Axon from "./axon.js";

export default class GranuleDentriteReceptor {
    constructor(gc, angle, length, receptorLength) {
        this.gc = gc;
        this.x = gc.x + length * Math.cos(angle);
        this.y = gc.y + length * Math.sin(angle);
        this.angle = angle;
        this.length = length;
        this.receptorLength = receptorLength;
    }

    render(p5) {
        const color = this.gc.getColor();
        p5.stroke(...color);
        p5.fill(...color);
        p5.line(this.gc.x, this.gc.y, this.x, this.y);

        p5.ellipse(
            this.x,
            this.y,
            this.receptorLength,
            this.receptorLength / 4
        );
    }
}
