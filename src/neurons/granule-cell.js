import { getRandomInt } from "../utils.js";
import { Neuron, Axon, Dendrites } from "./base.js";
import { Tree, JSONTreeLoader } from "../tree.js";
import Branch from "../branch.js";

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

    generateAxon() {
        const topY = getRandomInt(5, 150);
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
            end: { x: 1500, y: topY },
            level: 1,
            parent: vertical,
        });

        this.axon = new Axon({ tree: new Tree([vertical]) });
        this.axon.tree.addBranch(left, vertical);
        this.axon.tree.addBranch(right, vertical);
    }
}
