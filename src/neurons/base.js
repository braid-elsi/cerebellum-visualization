import Axon from "./axon.js";
import Dendrites from "./dendrites.js";
import { RandomTreeGenerator } from "../tree.js";

export default class Neuron {
    constructor({ x, y, width, color = [0, 0, 0], lineWidth = 6 }) {
        if (x === undefined || y === undefined || width === undefined) {
            throw new Error("x, y, and width are required parameters.");
        }
        Object.assign(this, { x, y, width, color, lineWidth });
        this.charge = 0;
        this.threshold = width;
        this.inputNeurons = new Map(); // Neurons that connect to this neuron
        this.outputNeurons = new Map(); // Neurons this neuron connects to
        this.dendrites = null;
        this.axon = null;
        this.type = "neuron";
    }

    // Connect this neuron to another neuron
    connectTo(neuron, numSynapses = 3) {
        if (neuron === this) {
            throw new Error("A neuron cannot connect to itself.");
        }
        if (numSynapses < 1) {
            throw new Error("Synapse count must be at least 1.");
        }
        this.outputNeurons.set(
            neuron,
            (this.outputNeurons.get(neuron) || 0) + numSynapses,
        );
        neuron.inputNeurons.set(
            this,
            (neuron.inputNeurons.get(this) || 0) + numSynapses,
        );
    }

    // Remove synaptic connections (or all if count is not specified)
    disconnectFrom(neuron, numSynapses = null) {
        if (!this.outputNeurons.has(neuron)) return;

        if (
            numSynapses === null ||
            numSynapses >= this.outputNeurons.get(neuron)
        ) {
            this.outputNeurons.delete(neuron);
            neuron.inputs.delete(this);
        } else {
            this.outputNeurons.set(
                neuron,
                this.outputNeurons.get(neuron) - numSynapses,
            );
            neuron.inputs.set(this, neuron.inputs.get(this) - numSynapses);
        }
    }

    // Get all connected neurons with synapse counts
    getConnections() {
        return {
            inputs: [...this.inputNeurons.entries()].map(([neuron, count]) => ({
                id: neuron.id,
                numSynapses: count,
            })),
            outputs: [...this.outputNeurons.entries()].map(
                ([neuron, count]) => ({
                    id: neuron.id,
                    numSynapses: count,
                }),
            ),
        };
    }

    generateAxon(maxLevel = 4, maxBranches = 1) {
        this.axon = new Axon({
            tree: RandomTreeGenerator.generate({
                startX: this.x,
                startY: this.y,
                maxLevel,
                numBranches: maxBranches,
                maxBranches,
                angle: Math.PI / 2,
            }),
            neuron: this,
        });
    }

    generateDendrites(numBranches = 2, maxLevel = 7) {
        // Generate a dendritic tree based on number of connections
        const tree = RandomTreeGenerator.generate({
            startX: this.x,
            startY: this.y,
            maxLevel,
            maxBranches: numBranches,
            angle: -Math.PI / 2,
        });

        this.dendrites = new Dendrites({ neuron: this, tree });
    }

    render(p5) {
        this.charge = Math.max(0, this.charge - 0.015);

        p5.strokeWeight(this.lineWidth);
        if (this.axon) {
            this.axon.render(p5);
        }
        if (this.dendrites) {
            this.dendrites.render(p5);
        }
        p5.fill(...this.color);
        p5.ellipse(this.x, this.y, this.width, this.width);
        p5.fill(0, 200, 200);
        p5.ellipse(this.x, this.y, this.charge, this.charge);
    }
}
