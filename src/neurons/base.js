import { logBase } from "../utils.js";
import { RandomTreeGenerator } from "../tree.js";
import { Receptor, Terminal } from "../synapses.js";

export class Dendrites {
    constructor({ neuron, tree }) {
        this.tree = tree;
        this.neuron = neuron;

        // Connect dendrite branches to the neuron
        this.tree.branches.forEach((branch) => (branch.neuron = neuron));

        const receptorBranches = this.tree.getTerminalBranches();
        this.receptors = receptorBranches.map(
            (branch) =>
                new Receptor({
                    width: Math.max(this.neuron.width * 0.4, 20),
                    branch,
                    color: this.neuron.color,
                }),
        );

        // Track available receptors
        // this.availableReceptors = new Set(this.receptors);
    }

    getAvailableReceptor() {
        const receptors = this.getAvailableReceptors();
        return receptors.size > 0 ? receptors[0] : null;
    }
    getAvailableReceptors() {
        // console.log(this.receptors);
        return this.receptors.filter((receptor) => !receptor.terminal);
    }

    getReceptorExtreme(compareFn, axis) {
        return this.receptors.reduce(
            (extreme, receptor) =>
                compareFn(receptor[axis], extreme[axis]) ? receptor : extreme,
            this.receptors[0],
        );
    }

    getReceptorMaxY() {
        return this.getReceptorExtreme((a, b) => a > b, "y");
    }
    getReceptorMaxX() {
        return this.getReceptorExtreme((a, b) => a > b, "x");
    }
    getReceptorMinX() {
        return this.getReceptorExtreme((a, b) => a < b, "x");
    }
    getReceptorMinY() {
        return this.getReceptorExtreme((a, b) => a < b, "y");
    }

    render(p5) {
        p5.stroke(...this.neuron.color);
        this.tree.render(p5);
        this.receptors.forEach((receptor) => receptor.render(p5));
    }
}

export class Axon {
    constructor({ neuron, tree, terminals = null }) {
        this.tree = tree;
        this.terminals = [];
        this.neuron = neuron;
        // this.terminals = terminals || this.generateTerminals();
    }

    generateTerminals() {
        const terminalBranches = this.tree.getTerminalBranches();

        // connect the roots of the dendrite trees to the source neuron
        return terminalBranches.map((branch) => {
            const terminal = new Terminal({ width: 20, branch, color: this.neuron.color });
            branch.terminal = terminal;
            return terminal;
        });
    }

    addTerminal(width, branch, receptor = null) {
        const terminal = new Terminal({ width, branch, color: this.neuron.color });
        branch.terminal = terminal;
        this.terminals.push(terminal);
        terminal.setReceptor(receptor);
    }

    render(p5) {
        p5.stroke(...this.neuron.color);
        this.tree.render(p5);
        this.terminals.forEach((terminal) => terminal.render(p5));
    }
}

export class Neuron {
    constructor({ x, y, width, color=[0, 0, 0] }) {
        if (x === undefined || y === undefined || width === undefined) {
            throw new Error("x, y, and width are required parameters.");
        }
        Object.assign(this, { x, y, width });
        this.charge = 0;
        this.threshold = width;
        this.inputNeurons = new Map(); // Neurons that connect to this neuron
        this.outputNeurons = new Map(); // Neurons this neuron connects to
        this.dendrites = null;
        this.axon = null;
        this.type = "neuron";
        this.color = color;
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

    generateAxon(maxLevel=4, maxBranches=1) {
        this.axon = new Axon({
            tree: RandomTreeGenerator.generate({
                startX: this.x,
                startY: this.y,
                maxLevel, 
                numBranches: maxBranches,
                maxBranches,
                angle: Math.PI / 2,
            }),
            neuron: this
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
