import { Neuron, Axon } from "./base.js";
import { Tree } from "../tree.js";
import Branch from "../branch.js";

export default class MossyFiberNeuron extends Neuron {
    constructor({ x, y, width }) {
        super({ x, y, width });
        this.type = "mf";
    }

    generateDendrites() {
        console.log("No dendrites!");
    }

    calculateAveragePosition(neurons) {
        return {
            x:
                neurons.reduce((sum, neuron) => sum + neuron.x, 0) /
                neurons.length,
            y: neurons.reduce(
                (max, neuron) => Math.max(max, neuron.y),
                neurons[0].y,
            ),
        };
    }

    createRootBranch() {
        if (!this.hasOutputNeurons()) return null;
        if (this.hasExistingAxon()) return this.axon.tree.branches[0];

        const neurons = [...this.outputNeurons.keys()];
        const targetPosition = this.calculateAveragePosition(neurons);

        const endPosition = {
            x: this.x + (targetPosition.x - this.x) / 2,
            y: this.y - (this.y - targetPosition.y) / 4,
        };

        const branch = new Branch({
            start: { x: this.x, y: this.y },
            end: endPosition,
            level: 0,
            parent: null,
        });

        this.axon = new Axon({ neuron: this, tree: new Tree([branch]) });
        return branch;
    }

    createReceptorBranch(receptor, parentBranch, neuron, level) {
        const synapseGapWidth = receptor.width / 3 - 1;
        const terminalWidth = Math.max(neuron.width * 0.4, 20);

        const branch = new Branch({
            start: parentBranch.end,
            end: {
                x: receptor.x,
                y: receptor.y + synapseGapWidth,
            },
            level: level + 1,
            parent: parentBranch,
        });

        this.axon.tree.addBranch(branch, parentBranch);
        this.axon.addTerminal(terminalWidth, branch, receptor);
        return branch;
    }

    connectNeuronReceptors({ neuron, numConnections, parentBranch, level }) {
        const availableReceptors = neuron.dendrites.getAvailableReceptors();

        if (availableReceptors.length < numConnections) {
            console.error("Insufficient available receptors");
            return;
        }

        const receptorsToConnect = availableReceptors.slice(0, numConnections);
        receptorsToConnect.forEach((receptor) => {
            this.createReceptorBranch(receptor, parentBranch, neuron, level);
        });
    }

    createTerminalBranches(parentBranch, neurons, level) {
        if (neurons.length <= 2) {
            // base case:
            neurons.forEach(([neuron, numConnections]) => {
                const receptors = neuron.dendrites
                    .getAvailableReceptors()
                    .slice(0, numConnections);

                const averageX =
                    receptors.reduce((sum, r) => sum + r.x, 0) / numConnections;
                const terminalBranch = new Branch({
                    start: parentBranch.end,
                    end: {
                        x: averageX,
                        y: Math.min(neuron.y + neuron.width * 3),
                    },
                    level,
                    parent: parentBranch,
                });

                parentBranch.addBranches([terminalBranch]);
                this.connectNeuronReceptors({
                    neuron,
                    numConnections,
                    parentBranch: terminalBranch,
                    level,
                });
            });
            return;
        }

        this.createBinaryBranches(parentBranch, neurons, level);
    }

    createBinaryBranches(parentBranch, neurons, level) {
        const midpoint = Math.floor(neurons.length / 2);
        const [firstHalf, secondHalf] = [
            neurons.slice(0, midpoint),
            neurons.slice(midpoint),
        ];

        [firstHalf, secondHalf].forEach((neuronGroup) => {
            const endPosition = this.calculateBranchEndpoint(
                parentBranch,
                neuronGroup,
            );
            const branch = new Branch({
                start: parentBranch.end,
                end: endPosition,
                level,
                parent: parentBranch,
            });

            this.createTerminalBranches(branch, neuronGroup, level + 1);
            parentBranch.addBranches([branch]);
        });
    }

    calculateBranchEndpoint(parentBranch, neurons) {
        const { sumX, maxY } = neurons.reduce(
            (acc, neuron) => ({
                sumX: acc.sumX + neuron[0].x,
                maxY: Math.max(acc.maxY, neuron[0].y),
            }),
            { sumX: 0, maxY: -Infinity },
        );

        return {
            x: sumX / neurons.length,
            y: parentBranch.end.y - Math.abs((maxY - parentBranch.end.y) / 3),
        };
    }

    hasOutputNeurons() {
        return this.outputNeurons && this.outputNeurons.size > 0;
    }

    hasExistingAxon() {
        return this.axon?.tree?.branches.length > 0;
    }

    generateAxon() {
        if (!this.hasOutputNeurons()) return;

        const rootBranch = this.createRootBranch();
        if (!rootBranch) return;

        const outputNeurons = Array.from(this.outputNeurons);
        this.createTerminalBranches(rootBranch, outputNeurons, 1);
    }
}
