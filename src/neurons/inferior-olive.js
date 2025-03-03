import Neuron from "./base.js";
import Axon from "./axon.js";
import { Tree } from "../tree.js";
import { Branch } from "../branch.js";

export default class InferiorOlive extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.height = this.width * 0.6
        this.type = "inferior-olive";
    }

    generateRootBranch(dcn) {
        const start = { x: this.x, y: this.y };
        const end = { x: this.x, y: dcn.y }
        const root = new Branch({
            start,
            end,
            level: 0,
            parent: null,
        });
        this.axon = new Axon({ neuron: this, tree: new Tree([root]) });
        return root;
    }

    generateAxon() {
        const dcns = [...this.outputNeurons.keys()];
        if (dcns.length > 1) {
            throw new Error("Purkinje neuron can only connect to one DCN");
        }
        if (dcns.length === 1) {
            const dcn = dcns[0];
            const root = this.generateRootBranch(dcn);
            const start = { x: this.x, y: dcn.y };
            const end = { x: dcn.x + dcn.width/2 + 11, y: dcn.y }
            const dcnBranch = new Branch({
                start,
                end,
                level: 1,
                parent: root,
            });
            root.addBranches([dcnBranch]);
            const receptor = dcn.findClosestReceptor(end);
            console.log("io to dcn receptor:", receptor);
            this.axon.addTerminal({
                width: 15,
                height: 5,
                branch: dcnBranch,
                receptor,
                doRotation: true
            });
        }
    }
}
