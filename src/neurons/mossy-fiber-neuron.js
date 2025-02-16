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

    getOrCreateAxonRoot() {
        if (this.axon && this.axon.tree && this.axon.tree.branches.length > 0) {
            console.log("Axon already exists. Returning the root branch");
            return this.axon.tree.branches[0];
        }
        if (!this.outputNeurons || this.outputNeurons.size === 0) {
            console.log("No output neurons to connect to.");
            return;
        }

        // create a new axon with a single branch that angles towards the middle of
        // all of the target cells:
        console.log("Creating the axon and the root branch");
        const neurons = [...this.outputNeurons.keys()];

        //get the trunk's end x-position:
        let endX =
            neurons.reduce((sum, neuron) => (sum += neuron.x), 0) /
            neurons.length;
        endX = this.x + (endX - this.x) / 2;

        let endY = neurons.reduce(
            (max, neuron) => (neuron.y > max ? neuron.y : max),
            neurons[0].y,
        );
        endY = this.y - (this.y - endY) / 4;

        const branch = new Branch({
            start: { x: this.x, y: this.y },
            end: {
                x: endX,
                y: endY,
            },
            level: 0,
            parent: null,
        });
        this.axon = new Axon({ tree: new Tree([branch]) });
        return branch;
    }

    getBranchEndpoint(parentBranch, neurons) {
        const result = neurons.reduce(
            (acc, neuron) => {
                acc.sumX += neuron[0].x;
                acc.maxY = Math.max(acc.maxY, neuron[0].y);
                return acc;
            },
            { sumX: 0, maxY: -Infinity },
        );

        return {
            x: result.sumX / neurons.length,
            y:
                parentBranch.end.y -
                Math.abs((result.maxY - parentBranch.end.y) / 3),
        };
    }

    getPenultimateX(neuron, numConnections) {
        const receptors = neuron.dendrites
            .getAvailableReceptors()
            .filter((receptor, idx) => idx < numConnections);
        console.log(receptors);
        return (
            receptors.reduce((sum, receptor) => (sum += receptor.x), 0) /
            numConnections
        );
        //return neuron.x;
    }

    addReceptorsToBranch({ neuron, numConnections, parentBranch, level }) {
        const availableReceptors = neuron.dendrites.getAvailableReceptors();
        if (availableReceptors.length < numConnections) {
            console.error(
                "There aren't enough receptors to attach to! Skipping.",
            );
            return;
        }
        for (let i = 0; i < numConnections; i++) {
            const receptor = availableReceptors[i];
            const synapseGapWidth = receptor.width / 3 - 1;

            const receptorBranch = new Branch({
                start: parentBranch.end,
                end: {
                    x: receptor.x,
                    y: receptor.y + synapseGapWidth,
                },
                level: level + 1,
                parent: parentBranch,
            });
            this.axon.tree.addBranch(receptorBranch, parentBranch);
            this.axon.addTerminal(
                Math.max(neuron.width * 0.4, 20),
                receptorBranch,
                receptor,
            );
        }
    }

    addBranches(parentBranch, remainingNeurons, level) {
        // Base case:
        if (remainingNeurons.length <= 2) {
            const branches = [];
            remainingNeurons.forEach((neuronPair) => {
                const [neuron, numConnections] = neuronPair;
                const x = this.getPenultimateX(neuron, numConnections);
                const branch = new Branch({
                    start: parentBranch.end,
                    end: {
                        x: x,
                        y: Math.min(
                            parentBranch.end.y - 20,
                            neuron.y + neuron.width * 3,
                        ),
                    },
                    level,
                    parent: parentBranch,
                });
                branches.push(branch);
                this.addReceptorsToBranch({
                    neuron,
                    numConnections,
                    parentBranch: branch,
                    level,
                });
            });
            parentBranch.addBranches(branches);
            return;
        }

        // Binary branching logic:
        const splitIndex = Math.floor(remainingNeurons.length / 2);
        const firstHalf = remainingNeurons.slice(0, splitIndex);
        const secondHalf = remainingNeurons.slice(splitIndex);

        // for each neuron group, create a new branch:
        [firstHalf, secondHalf].forEach((neuronGroup) => {
            const { x, y } = this.getBranchEndpoint(parentBranch, neuronGroup);
            const branch = new Branch({
                start: parentBranch.end,
                end: { x: x, y: y },
                level,
                parent: parentBranch,
            });
            this.addBranches(branch, neuronGroup, level + 1);
            parentBranch.addBranches([branch]);
        });
    }

    generateAxon() {
        if (!this.outputNeurons || this.outputNeurons.size === 0) {
            return;
        }
        const rootBranch = this.getOrCreateAxonRoot();
        // Start recursive tree construction
        const outputNeurons = Array.from(this.outputNeurons);
        this.addBranches(rootBranch, outputNeurons, 1);
    }

    generateAxon1() {
        if (!this.outputNeurons || this.outputNeurons.size === 0) {
            return;
        }

        const root = this.getOrCreateAxonRoot();

        // generate axon branches that will synapse onto each output neuron
        for (const [targetNeuron, numConnections] of this.outputNeurons) {
            const availableReceptors =
                targetNeuron.dendrites.getAvailableReceptors();
            if (availableReceptors.length < numConnections) {
                throw Error("There aren't enough receptors to attach to!");
            }
            for (let i = 0; i < numConnections; i++) {
                const receptor = availableReceptors[i];
                const synapseGapWidth = receptor.width / 3 - 1;

                const branch = new Branch({
                    start: root.end,
                    end: {
                        x: receptor.x,
                        y: receptor.y + synapseGapWidth,
                    },
                    level: 1,
                    parent: root,
                });
                this.axon.tree.addBranch(branch, root);
                this.axon.addTerminal(
                    Math.max(targetNeuron.width * 0.4, 20),
                    branch,
                    receptor,
                );
            }
        }
    }
}
