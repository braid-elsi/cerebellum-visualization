import { Neuron } from "./base.js";


export default class PurkinjeNeuron extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.type = "purkinje";
    }

    generateDendrites() {
        super.generateDendrites();
    }

    generateAxon() {
        super.generateAxon();
    }
}
