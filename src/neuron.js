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
            (branch) => new Receptor({ width: 20, branch }),
        );

        // Track available receptors
        // this.availableReceptors = new Set(this.receptors);
    }

    getAvailableReceptor() {
        return this.availableReceptors.size > 0
            ? [...this.availableReceptors][0]
            : null;
    }
    getAvailableReceptors() {
        return this.receptors.filter((receptor) => !receptor.terminal);
    }

    // markReceptorAsUsed(receptor) {
    //     this.availableReceptors.delete(receptor);
    // }

    getReceptorExtreme(compareFn, axis) {
        // const availableReceptors = this.receptors.filter(
        //     (receptor) => receptor.terminal === null,
        // );
        // console.log(JSON.stringify(availableReceptors));
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

    finalizeConnections() {
        // Now that all connections are known, generate dendrites and axon
        this.generateDendrites();
        this.generateAxon();
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
        console.log("totalConnections", totalConnections);

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
        this.charge = Math.max(0, this.charge - 0.005);

        if (this.axon) {
            this.axon.render(p5);
        }
        if (this.dendrites) {
            this.dendrites.render(p5);
        }
        p5.ellipse(this.x, this.y, this.width, this.width);
        p5.fill(255, 0, 0);
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

    // generateAxon() {
    //     let pointArray = [];
    //     for (const [targetNeuron, numConnections] of this.outputNeurons) {
    //         console.log(
    //             "Target Neuron:",
    //             targetNeuron,
    //             "numConnections",
    //             numConnections,
    //         );
    //         pointArray.push(
    //             ...this.generateBranchJSON(targetNeuron, numConnections),
    //         );
    //     }
    //     const tree = JSONTreeLoader.fromJSON(pointArray);
    //     this.axon = new Axon({ tree });
    //     for (const [targetNeuron, numConnections] of this.outputNeurons) {
    //         // this doesn't work b/c every terminal only has one receptor and
    //         // both neurons are trying to attach to all of the available receptors.
    //         // the solution is to ensure that the target terminals are the argument,
    //         // not the entire cell:
    //         this.attachTerminalsToReceptors(targetNeuron, numConnections);
    //     }
    // }

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
        const endX =
            neurons.reduce((sum, neuron) => (sum += neuron.x), 0) /
            neurons.length;
        let endY = neurons.reduce(
            (max, neuron) => (neuron.y > max ? neuron.y : max),
            neurons[0].y,
        );
        endY = this.y - (this.y - endY) / 2;

        const branch = new Branch({
            start: { x: this.x, y: this.y },
            end: { x: endX, y: endY },
            level: 0,
            parent: null,
        });
        this.axon = new Axon({ tree: new Tree([branch]) });
        return branch;
    }

    generateAxon() {
        if (!this.outputNeurons || this.outputNeurons.size === 0) {
            return;
        }
        /* 
        New algorithm:
            1. Check if an Axon tree is defined. If not, create the root branch. Position it
               at the midpoint of the output Neurons.
                    * The tree now has one root branch.
            2. For each output neuron, add a new branch to the root branch that connects
               to the specified number of unoccupied receptors. 
                    * After the is done, attached the terminals to the receptors right away
            
        By doing it this way, the axons should be able to grow dynamically!
        */
        const root = this.getOrCreateAxonRoot();

        for (const [targetNeuron, numConnections] of this.outputNeurons) {
            const availableReceptors =
                targetNeuron.dendrites.getAvailableReceptors();
            if (availableReceptors.length < numConnections) {
                throw Error("There aren't enough receptors to attach to!");
            }
            for (let i = 0; i < numConnections; i++) {
                const receptor = availableReceptors[i];
                const synapseGapWidth = receptor.width / 3;

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
                this.axon.addTerminal(20, branch, receptor);
            }
        }
    }

    initializeAxon() {
        const tree = JSONTreeLoader.fromJSON(pointArray);
        this.axon = new Axon({ tree });
    }

    generateBranchJSON(targetCell, numConnections) {
        // aim for target cell:
        const points = [];
        const branchY = targetCell.dendrites.getReceptorMaxY(); //targetCell.y

        const y2 = branchY.y + 3 * targetCell.width;
        let x2 = ((targetCell.x - mfX) / 5) * 4 + mfX;
        let level = 0;
        console.log(x2, y2, level);

        // level 1:
        points.push({
            start: { x: this.x, y: this.y },
            end: { x: x2, y: y2 },
            level: level,
        });
        ++level;

        // level 2:
        const receptors = targetCell.dendrites.receptors.filter(
            (receptor) => !receptor.terminal,
        );
        for (let i = 0; i < numConnections; i++) {
            console.log("numReceptors:", receptors.length);
            const receptor = receptors[i];
            if (!receptor) {
                throw Error("Something went wrong!");
            }
            const synapseGapWidth = receptor.width / 3;
            points.push({
                start: { x: x2, y: y2 },
                end: {
                    x: receptor.x,
                    y: receptor.y + synapseGapWidth,
                },
                level: level,
            });
        }
        return points;
    }

    // getClosestReceptor(terminal, receptors) {
    //     const availableReceptors = receptors.filter(
    //         (receptor) => receptor.terminal === null,
    //     );
    //     if (availableReceptors.length === 0) return null;

    //     const closest = availableReceptors.reduce(
    //         (closest, receptor) =>
    //             dist1(terminal.x, terminal.y, receptor.x, receptor.y) <
    //             dist1(terminal.x, terminal.y, closest.x, closest.y)
    //                 ? receptor
    //                 : closest,
    //         availableReceptors[0],
    //     );

    //     // Mark as used before returning
    //     closest.terminal = terminal;
    //     return closest;
    // }
}
