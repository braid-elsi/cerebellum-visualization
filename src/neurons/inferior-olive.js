import Neuron from "./base.js";
import Axon from "./axon.js";
import { Tree } from "../tree.js";
import { Branch } from "../branch.js";

export default class InferiorOlive extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.height = this.width * 0.6;
        this.type = "inferior-olive";
        this.labelText = "Inferior Olive"
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
        const neurons = [...this.outputNeurons.keys()];
        const dcns = neurons.filter(neuron => neuron.type === "dcn");
        
        if (dcns.length > 1) {
            throw new Error("Inferior Olive neuron can only connect to one DCN (for now)");
        }
        if (dcns.length === 0) {
            throw new Error("This function needs a DCN connection, but none found.");
        }

        // connect w/DCN:
        const dcn = dcns[0];
        const root = this.generateRootBranch(dcn);
        let start = { x: this.x, y: dcn.y };
        let end = { x: dcn.x + dcn.width/2 + 11, y: dcn.y }
        const dcnBranch = new Branch({
            start,
            end,
            level: 1,
            parent: root,
        });
        root.addBranches([dcnBranch]);
        let receptor = dcn.findClosestReceptor(end);
        this.axon.addTerminal({
            width: 15,
            height: 5,
            branch: dcnBranch,
            receptor,
            doRotation: true
        });

        // connect w/Purkinje neuron:
        const purkinjeNeurons = neurons.filter(neuron => neuron.type === "purkinje");
        if (dcns.length > 1) {
            throw new Error("Inferior Olive neuron can only connect to one Purkinje (for now)");
        }
        if (purkinjeNeurons.length === 0) {
            throw new Error("This function needs a Purkinje neuron connection, but none found.");
        }
        const purkinje = purkinjeNeurons[0];
        end = { x: root.end.x, y: purkinje.y + 200 };
        const purkinjeBranch = new Branch({
            start: root.end,
            end,
            level: 1,
            parent: root,
        });
        root.addBranches([purkinjeBranch]);
        const clonedPurkinjeBranch = purkinje.dendrites.tree.branches[0].clone(6);
        clonedPurkinjeBranch.updateStartpoint({...end})
        purkinjeBranch.attachBranchAtPoint(end, clonedPurkinjeBranch);
        purkinjeBranch.setCurvy(true, false);
        clonedPurkinjeBranch.generateAllControlPoints()
    }

    render(p5) {
        super.render(p5);
        this.renderLabel(p5);
    }
}
