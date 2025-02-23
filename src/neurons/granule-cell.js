import { getRandomInt } from "../utils.js";
import Neuron from "./base.js";
import Axon from "./axon.js";
import Dendrites from "./dendrites.js";
import { Tree, JSONTreeLoader } from "../tree.js";
import { Branch } from "../branch.js";

export default class GranuleCell extends Neuron {
    constructor({ x, y, width }) {
        super({ x, y, width });
        this.type = "gc";
    }

    // Generates dendrites to accomodate all of the input neurons
    // that will be synapsing onto this neuron;
    generateDendrites() {
        const points = [];
        const totalSynapses = [...this.inputNeurons.values()].reduce(
            (sum, value) => sum + value,
            0,
        );
        const start = Math.PI - Math.PI / 6;
        const angleRange = Math.PI - Math.PI / 3;
        const delta = angleRange / (totalSynapses - 1);
        let angle = start;
        for (let i = 0; i < totalSynapses; i++) {
            const radius = getRandomInt(this.width * 0.75, this.width * 1.5);
            let x = this.x + radius * Math.cos(angle);
            let y = this.y + radius * Math.sin(angle);
            points.push({
                start: { x: this.x, y: this.y },
                end: { x: x, y: y },
                level: 0,
            });
            angle -= delta;
        }
        const tree = JSONTreeLoader.fromJSON(points);
        this.dendrites = new Dendrites({ neuron: this, tree });
    }

    generateAxon(topY) {
        topY = topY || getRandomInt(5, 300);
        const vertical = new Branch({
            start: { x: this.x, y: this.y },
            end: { x: this.x, y: topY },
            level: 0,
            parent: null,
        });
        const left = new Branch({
            start: { x: this.x, y: topY },
            end: { x: 0, y: topY },
            level: 1,
            parent: vertical,
        });
        const right = new Branch({
            start: { x: this.x, y: topY },
            end: { x: 2000, y: topY },
            level: 1,
            parent: vertical,
        });

        this.axon = new Axon({ neuron: this, tree: new Tree([vertical]) });
        this.axon.tree.addBranch(left, vertical);
        this.axon.tree.addBranch(right, vertical);
    }

    addTerminalToBranch(currentBranch, point) {
        // Debug output before modification

        // 1. Create two new children:
        const secondHalf = new Branch({
            start: point,
            end: { ...currentBranch.end },
            level: currentBranch.level + 1,
            parent: currentBranch,
            branches: [...currentBranch.branches],
        });
        secondHalf.branches.forEach((b) => (b.parent = secondHalf));

        const currentBranchTerminal = new Branch({
            start: point,
            end: { x: point.x, y: point.y },
            level: currentBranch.level + 1,
            parent: currentBranch,
        });

        // 2. Create the terminal
        const terminal = this.axon.addTerminal({
            width: 9,
            height: 9,
            branch: currentBranchTerminal,
            receptor: null,
            doRotation: true,
        });

        // 3. Update the current branch and its relationships
        secondHalf.updateLevelsRecursively(currentBranch.level + 1);
        currentBranch.update({
            end: point,
            branches: [secondHalf, currentBranchTerminal],
        });

        // Debug output after modification
        return terminal;
    }



    // render(p5) {}
}
