import Axon from "./axon";

export default class Neuron {
    constructor(x, y, w, color = [255, 0, 0]) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.color = color;
    }

    render(p) {
        p.stroke(...this.color);
        this.p.fill(...this.color);
        this.p.ellipse(this.x, this.y, this.w, this.w);
    }
}
