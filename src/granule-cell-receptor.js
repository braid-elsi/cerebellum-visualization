// import Axon from "./axon.js";

export default class GranuleDentriteReceptor {
    constructor(x, y, angle, length, receptorLength, color = [98, 104, 190]) {
        console.log(x, y, angle, length);
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.length = length;
        this.receptorLength = receptorLength;
        this.color = color;
    }

    render(p5) {
        let x1 = this.x + this.length * Math.cos(this.angle);
        let y1 = this.y + this.length * Math.sin(this.angle);
        p5.stroke(...this.color);
        p5.fill(...this.color);
        console.log(this.x, this.y, x1, y1);
        p5.line(this.x, this.y, x1, y1);

        p5.ellipse(x1, y1, this.receptorLength, this.receptorLength / 4);
    }
}
