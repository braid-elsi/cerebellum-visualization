import { Neuron, Axon } from "./base.js";
import Branch from "../branch.js";
import { Tree } from "../tree.js";

export default class PurkinjeNeuron extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.type = "purkinje";
    }

    generateDendrites() {
        super.generateDendrites();
    }

    generateAxon() {
        const vertical = new Branch({
            start: { x: this.x, y: this.y },
            end: { x: this.x, y: this.y + 500 },
            level: 0,
            parent: null,
        });


        this.axon = new Axon({ neuron: this, tree: new Tree([vertical]) });
    }
}
