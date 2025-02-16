import { getRandomInt, dist1, logBase } from "./utils.js";
import { Tree, JSONTreeLoader, RandomTreeGenerator } from "./tree.js";
import Branch from "./branch.js";
import { Receptor, Terminal } from "./synapses.js";

class Dendrites {
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
        this.tree.render(p5);
        this.receptors.forEach((receptor) => receptor.render(p5));
    }
}

class Axon {
    constructor({ tree, terminals = null }) {
        this.tree = tree;
        this.terminals = [];
        // this.terminals = terminals || this.generateTerminals();
    }

    generateTerminals() {
        const terminalBranches = this.tree.getTerminalBranches();

        // connect the roots of the dendrite trees to the source neuron
        return terminalBranches.map((branch) => {
            const terminal = new Terminal({ width: 20, branch });
            branch.terminal = terminal;
            return terminal;
        });
    }

    addTerminal(width, branch, receptor = null) {
        const terminal = new Terminal({ width, branch });
        branch.terminal = terminal;
        this.terminals.push(terminal);
        terminal.setReceptor(receptor);
    }

    render(p5) {
        this.tree.render(p5);
        this.terminals.forEach((terminal) => terminal.render(p5));
    }
}

export class Neuron {
    constructor({ x, y, width }) {
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

    generateAxon() {
        console.log("generate axon.");
    }

    // generateAxon() {
    //     this.axon = new Axon({
    //         tree: RandomTreeGenerator.generate({
    //             startX: this.x,
    //             startY: this.y,
    //             maxLevel: this.maxLevel, // Use class properties
    //             maxBranches: this.maxBranches,
    //             angle: -Math.PI / 2,
    //         }),
    //     });
    // }

    generateDendrites(numBranches = 2) {
        console.log("generating neuron dendrites...");
        const totalConnections = this.postsynapticNeurons.reduce(
            (sum, conn) => sum + conn.numSynapses,
            0,
        );
        if (totalConnections === 0) {
            return;
        }

        // Generate a dendritic tree based on number of connections
        const tree = RandomTreeGenerator.generate({
            startX: this.x,
            startY: this.y,
            maxLevel: logBase(totalConnections.numBranches),
            maxBranches: numBranches,
            angle: Math.PI / 2,
        });

        this.dendrites = new Dendrites({ neuron: this, tree });
    }

    render(p5) {
        p5.fill(0, 0, 0);
        this.charge = Math.max(0, this.charge - 0.015);

        if (this.axon) {
            this.axon.render(p5);
        }
        if (this.dendrites) {
            this.dendrites.render(p5);
        }
        p5.ellipse(this.x, this.y, this.width, this.width);
        p5.fill(0, 200, 200);
        p5.ellipse(this.x, this.y, this.charge, this.charge);
    }
}

export class GranuleCell extends Neuron {
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

export class MossyFiberNeuron extends Neuron {
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
                (parentBranch.end.y - result.maxY) / 4,
        };
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
                const branch = new Branch({
                    start: parentBranch.end,
                    end: { x: neuron.x, y: neuron.y + neuron.width * 2 },
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

    // TODO: start here to make a binary tree from mossy fibers
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
