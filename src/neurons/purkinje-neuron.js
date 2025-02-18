import Neuron from "./base.js";
import Axon from "./axon.js";
import Dendrites from "./dendrites.js";
import Branch from "../branch.js";
import { Tree, PurkinjeTreeGenerator } from "../tree.js";

export default class PurkinjeNeuron extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.type = "purkinje";
    }

    generateDendrites(numBranches = 2, maxLevel = 9) {
        // Generate a dendritic tree based on number of connections
        const tree = PurkinjeTreeGenerator.generate({
            x: this.x,
            y: this.y,
            numBranches,
            maxLevel: maxLevel,
            numBranches: numBranches,
            angle: -Math.PI / 2,
            yMax: this.y,
        });

        this.dendrites = new Dendrites({ neuron: this, tree });
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
