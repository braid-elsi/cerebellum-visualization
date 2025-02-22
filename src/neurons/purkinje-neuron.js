import Neuron from "./base.js";
import Axon from "./axon.js";
import Dendrites from "./dendrites.js";
import { Branch } from "../branch.js";
import { Tree, PurkinjeTreeGenerator, PurkinjeTreeLoader } from "../tree.js";
import { Receptor } from "../synapses.js";

export default class PurkinjeNeuron extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.type = "purkinje";
    }

    async generateDendrites(numBranches = 2, maxLevel = 9) {
        // Generate a dendritic tree based on number of connections
        // const tree = PurkinjeTreeGenerator.generate({
        //     x: this.x,
        //     y: this.y,
        //     numBranches,
        //     maxLevel: maxLevel,
        //     numBranches: numBranches,
        //     angle: -Math.PI / 2,
        //     yMax: this.y,
        // });

        const tree = await PurkinjeTreeLoader.loadTreeFromJSON(
            "./180524_E1_KO.json",
            {
                offsetX: this.x,
                offsetY: this.y,
                scale: 4,
            },
        );

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

    addReceptorToBranch(currentBranch, point) {
        // 1. Create two new children:
        const secondHalf = new Branch({
            start: point,
            end: { ...currentBranch.end },
            level: currentBranch.level + 1,
            parent: currentBranch,
            branches: currentBranch.branches,
        });

        const currentBranchReceptor = new Branch({
            start: point,
            end: { x: point.x + 1, y: point.y + 1 },
            level: currentBranch.level + 1,
            parent: currentBranch,
        });

        // 2. Create receptor:
        const receptor = new Receptor({
            width: Math.max(this.width * 0.4, 20),
            branch: currentBranchReceptor,
            color: this.color,
        });
        this.dendrites.addReceptor(receptor);

        // 3. Transfer the current branch's children to the new branch:
        currentBranch.update({
            end: point,
            branches: [secondHalf, currentBranchReceptor],
        });
        secondHalf.branches.forEach((b) => (b.parent = secondHalf));
        secondHalf.updateLevelsRecursively(currentBranch.level + 1);
        // secondHalf.branches = currentBranch.branches;

        return receptor;
    }

    // render(p5) {}
}
