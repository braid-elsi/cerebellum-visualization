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
        //     maxLevel: 4,
        //     numBranches: numBranches,
        //     angle: -Math.PI / 2,
        //     yMax: this.y,
        // });

        const tree = await PurkinjeTreeLoader.loadTreeFromJSON(
            "./180524_E1_KO.json",
            {
                offsetX: this.x,
                offsetY: this.y,
                scale: 6,
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
        // Store the original children before we modify anything
        const originalChildren = [...(currentBranch.branches || [])];
        const originalLevel = currentBranch.level;

        // Helper function to recursively increment levels of a branch and its children
        const incrementLevels = (branch) => {
            branch.level++;
            (branch.branches || []).forEach(child => incrementLevels(child));
        };

        // Increment the level of the current branch and all its children
        //incrementLevels(currentBranch);

        // 1. Create two new children at the original level
        const secondHalf = new Branch({
            start: point,
            end: { ...currentBranch.end },
            level: originalLevel + 1,
            parent: currentBranch,
            branches: [], // Start with empty branches
        });

        const currentBranchReceptor = new Branch({
            start: point,
            end: { x: point.x, y: point.y - 2 },
            level: originalLevel + 1,
            parent: currentBranch,
            branches: null,
        });

        // 2. Create receptor:
        const receptor = new Receptor({
            width: Math.max(this.width * 0.4, 20),
            branch: currentBranchReceptor,
            color: this.color,
        });
        this.dendrites.addReceptor(receptor);

        // 3. Update the current branch to end at the intersection
        currentBranch.update({
            end: point,
            branches: [secondHalf, currentBranchReceptor],
        });

        // 4. Move original children to secondHalf
        if (originalChildren.length > 0) {
            secondHalf.branches = originalChildren;
            originalChildren.forEach(child => {
                child.parent = secondHalf;
                child.start = secondHalf.end;
                child.updateGeometry();
            });
            // No need to update levels recursively since we're maintaining original levels
        }
        incrementLevels(secondHalf);

        return receptor;
    }

    // render(p5) {}
}
