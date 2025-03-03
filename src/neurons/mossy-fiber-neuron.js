import Neuron from "./base.js";
import Axon from "./axon.js";
import { Tree } from "../tree.js";
import { Branch } from "../branch.js";

export default class MossyFiberNeuron extends Neuron {
    constructor({ x, y, width }) {
        super({ x, y, width });
        this.type = "mf";
    }

    generateDendrites() {
        console.log("No dendrites!");
    }

    /**
     * Calculates the average position for a group of neurons
     * @param {Array} neurons - Array of neurons to calculate position for
     * @returns {Object} Position with x being the average x coordinate and y being the maximum y coordinate
     */
    calculateAveragePosition(neurons) {
        // Reduce the neurons array to get sum of x coordinates and maximum y coordinate
        const sum = neurons.reduce((acc, n) => ({
            x: acc.x + n.x,          // Sum up all x coordinates
            y: Math.max(acc.y, n.y)  // Keep track of the highest y coordinate
        }));

        return { x: sum.x / neurons.length, y: sum.y };
    }

    createRootBranch() {
        if (!this.hasOutputNeurons() || this.hasExistingAxon()) {
            return this.axon?.tree?.branches[0];
        }
        // filter out the DCN neurons before creating the root branch.
        // DCNs are incorporated into the root branch later.
        const neurons = [...this.outputNeurons.keys()];
        const gcNeurons = neurons.filter(neuron => neuron.type === "gc");
        const targetPosition = this.calculateAveragePosition(gcNeurons);
        const branch = new Branch({
            start: { x: this.x, y: this.y },
            end: {
                x: this.x + (targetPosition.x - this.x) / 2,
                y: this.y - (this.y - targetPosition.y) / 4,
            },
            level: 0,
            parent: null,
        });

        this.axon = new Axon({ neuron: this, tree: new Tree([branch]) });
        return branch;
    }

    createReceptorBranch(receptor, parentBranch, level) {
        const terminal = { width: 15, height: 5 };
        const branch = new Branch({
            start: parentBranch.end,
            end: {
                x: receptor.x,
                y: receptor.y + terminal.height + 1,
            },
            level: level + 1,
            parent: parentBranch,
        });

        this.axon.tree.addBranch(branch, parentBranch);
        this.axon.addTerminal({
            width: terminal.width,
            height: terminal.height,
            branch,
            receptor,
            doRotation: false
        });
        return branch;
    }

    connectNeuronReceptors({ neuron, numConnections, parentBranch, level }) {
        const receptors = neuron.dendrites.getAvailableReceptors().slice(0, numConnections);
        
        if (receptors.length < numConnections) {
            console.error("Insufficient available receptors");
            return;
        }
        
        receptors.forEach(receptor => 
            this.createReceptorBranch(receptor, parentBranch, level)
        );
    }

    createTerminalBranchesForDCNs(currentBranch, dcn) {
        console.log("dcn", dcn);
        const start = { x: this.x, y: dcn.y };
        const end = { x: dcn.x - dcn.width/2 - 11, y: dcn.y }
        const newBranch = new Branch({
            start,
            end,
            level: currentBranch.level + 1,
            parent: currentBranch,
        });
        currentBranch.attachBranchAtPoint(start, newBranch);
        this.axon.addTerminal({
            width: 15,
            height: 5,
            branch: newBranch,
            receptor: dcn.findClosestReceptor(end),
            doRotation: true
        });
    }

    createTerminalBranchesForGCs(parentBranch, neurons, level) {
        if (neurons.length <= 2) {
            neurons.forEach(([neuron, numConnections]) => {
                const receptors = neuron.dendrites.getAvailableReceptors().slice(0, numConnections);
                const averageX = receptors.reduce((sum, r) => sum + r.x, 0) / numConnections;
                
                const terminalBranch = new Branch({
                    start: parentBranch.end,
                    end: { x: averageX, y: Math.min(neuron.y + neuron.width * 3) },
                    level,
                    parent: parentBranch,
                });

                parentBranch.addBranches([terminalBranch]);
                this.connectNeuronReceptors({ neuron, numConnections, parentBranch: terminalBranch, level });
            });
            return;
        }

        const mid = Math.floor(neurons.length / 2);
        [neurons.slice(0, mid), neurons.slice(mid)].forEach(group => {
            const branch = new Branch({
                start: parentBranch.end,
                end: this.calculateBranchEndpoint(parentBranch, group),
                level,
                parent: parentBranch,
            });

            this.createTerminalBranchesForGCs(branch, group, level + 1);
            parentBranch.addBranches([branch]);
        });
    }

    calculateBranchEndpoint(parentBranch, neurons) {
        const { sumX, maxY } = neurons.reduce(
            (acc, neuronMap) => {
                const neuron = neuronMap[0];
                // find the average x coordinate of the remaining receptors:
                const receptorXs = neuron.dendrites.getAvailableReceptors().map(r => r.x);
                const x = receptorXs.reduce((x1, x2) =>  x1 + x2, 0) / receptorXs.length;
                return {
                    sumX: acc.sumX + x,
                    maxY: Math.max(acc.maxY, neuron.y),
                }
            },
            { sumX: 0, maxY: -Infinity },
        );

        return {
            x: sumX / neurons.length,
            y: parentBranch.end.y - Math.abs((maxY - parentBranch.end.y) / 3),
        };
    }
    

    generateAxon() {
        if (!this.hasOutputNeurons()) return;

        const rootBranch = this.createRootBranch();
        if (!rootBranch) return;

        const outputNeurons = Array.from(this.outputNeurons);
        // create MF-GC connections:
        const gcNeurons = outputNeurons.filter(n => n[0].type === "gc");
        this.createTerminalBranchesForGCs(rootBranch, gcNeurons, 1);

        // create MF-DCN connections:
        const dcnNeurons = outputNeurons.filter(n => n[0].type === "dcn");
        if (dcnNeurons.length > 1) {
            throw Error("There should only be one DCN neuron per MF");
        }
        if (dcnNeurons.length === 1) {
            const dcn = dcnNeurons[0][0];
            this.createTerminalBranchesForDCNs(rootBranch, dcn);
        }
    }
}
