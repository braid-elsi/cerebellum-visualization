import Neuron from "./base.js";
import Dendrites from "./dendrites.js";
import { JSONTreeLoader } from "../tree.js";

export default class DeepCerebellarNuclei extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.height = this.width * 0.6;
        this.type = "dcn";
        this.labelText = "Cerebellar Nuclei"
    }

    async generateDendrites() {
        const xDist = this.width / 2 + 5;
        const yDist = this.height / 2 + 5;
        const points = [
            { start: { x: this.x, y: this.y }, end: { x: this.x - xDist, y: this.y }, level: 0 },
            { start: { x: this.x, y: this.y }, end: { x: this.x, y: this.y - yDist }, level: 0 },
            { start: { x: this.x, y: this.y }, end: { x: this.x + xDist, y: this.y }, level: 0 }
        ];

        const dendriteOptions = {
            neuron: this,
            tree: JSONTreeLoader.fromJSON(points),
            receptorOptions: {
                width: 15,
                height: 5,
                doRotation: true,
                color: this.color,
            },
        };
        this.dendrites = new Dendrites(dendriteOptions);
    }

    generateAxon() {
        console.log("No axon!");
    }

    render(p5) {
        this.charge = Math.max(0, this.charge - 0.015);

        p5.strokeWeight(0);
        if (this.axon) {
            this.axon.render(p5);
        }
        if (this.dendrites) {
            this.dendrites.render(p5);
        }
        p5.fill(...this.color);
        p5.ellipse(this.x, this.y, this.width, this.height);
        p5.fill(0, 200, 200);
        p5.ellipse(this.x, this.y, this.charge, this.charge * 0.575);
        this.renderLabel(p5);
    }
}
