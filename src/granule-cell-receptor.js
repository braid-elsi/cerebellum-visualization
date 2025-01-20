// import Axon from "./axon.js";

export default class GranuleDentriteReceptor {
    constructor(gc, angle, length, receptorLength, color = [98, 104, 190]) {
        // console.log(x, y, angle, length);
        this.gc = gc;
        this.x = gc.x + length * Math.cos(angle);
        this.y = gc.y + length * Math.sin(angle);
        this.angle = angle;
        this.length = length;
        this.receptorLength = receptorLength;
        this.color = color;
    }

    render(p5) {
        p5.stroke(...this.color);
        p5.fill(...this.color);
        // console.log(this.x, this.y, x1, y1);
        p5.line(this.gc.x, this.gc.y, this.x, this.y);

        p5.ellipse(
            this.x,
            this.y,
            this.receptorLength,
            this.receptorLength / 4
        );
    }
}
