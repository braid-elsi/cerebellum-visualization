import { getRandomInt } from "../utils.js";
import { Neuron, Axon, Dendrites } from "./base.js";
import { Tree, JSONTreeLoader } from "../tree.js";
import Branch from "../branch.js";

export default class GranuleCell extends Neuron {
    constructor({ x, y, width }) {
        super({ x, y, width });
        this.type = "gc";
    }

    generateDendrites() {
        const totalSynapses = this.calculateTotalSynapses();
        const dendritePoints = this.calculateDendritePoints(totalSynapses);
        const tree = JSONTreeLoader.fromJSON(dendritePoints);
        this.dendrites = new Dendrites({ neuron: this, tree });
    }

    calculateTotalSynapses() {
        return [...this.inputNeurons.values()].reduce(
            (sum, value) => sum + value,
            0,
        );
    }

    calculateDendritePoints(totalSynapses) {
        if (totalSynapses <= 1) return [];

        const angleConfig = {
            start: Math.PI - Math.PI / 6,
            range: Math.PI - Math.PI / 3,
            delta: (Math.PI - Math.PI / 3) / (totalSynapses - 1),
        };

        return Array.from({ length: totalSynapses }, (_, index) => {
            const angle = angleConfig.start - angleConfig.delta * index;
            const radius = this.getRandomDendriteRadius();

            return {
                start: this.getPosition(),
                end: this.calculateEndPoint(angle, radius),
                level: 0,
            };
        });
    }

    getRandomDendriteRadius() {
        return getRandomInt(this.width * 0.75, this.width * 1.5);
    }

    getPosition() {
        return { x: this.x, y: this.y };
    }

    calculateEndPoint(angle, radius) {
        return {
            x: this.x + radius * Math.cos(angle),
            y: this.y + radius * Math.sin(angle),
        };
    }

    generateAxon() {
        const verticalBranch = this.createVerticalBranch();
        this.axon = new Axon({ tree: new Tree([verticalBranch]) });

        this.createHorizontalBranches(verticalBranch);
    }

    createVerticalBranch() {
        const topY = getRandomInt(5, 150);
        return new Branch({
            start: this.getPosition(),
            end: { x: this.x, y: topY },
            level: 0,
            parent: null,
        });
    }

    createHorizontalBranches(verticalBranch) {
        const branchConfig = {
            startX: this.x,
            y: verticalBranch.end.y,
            level: 1,
            parent: verticalBranch,
        };

        const leftBranch = new Branch({
            start: { x: branchConfig.startX, y: branchConfig.y },
            end: { x: 0, y: branchConfig.y },
            level: branchConfig.level,
            parent: branchConfig.parent,
        });

        const rightBranch = new Branch({
            start: { x: branchConfig.startX, y: branchConfig.y },
            end: { x: 1500, y: branchConfig.y },
            level: branchConfig.level,
            parent: branchConfig.parent,
        });

        this.axon.tree.addBranch(leftBranch, verticalBranch);
        this.axon.tree.addBranch(rightBranch, verticalBranch);
    }
}
