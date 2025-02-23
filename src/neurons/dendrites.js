import { Receptor } from "../synapses.js";

export default class Dendrites {
    constructor({ 
            neuron, 
            tree, 
            receptorOptions = { width: 15, height: 5, color: null, doRotation: false } 
        }) {
        this.tree = tree;
        this.neuron = neuron;

        // Connect dendrite branches to the neuron
        this.tree.branches.forEach((branch) => (branch.neuron = neuron));

        const receptorBranches = this.tree.getTerminalBranches();
        this.receptors = receptorBranches.map(
            (branch) => {
                const {width, height, color, doRotation} = receptorOptions;
                return new Receptor({
                    width: width || 15,
                    height: height || 5,
                    branch,
                    color: color || this.neuron.color,
                    doRotation: doRotation || false
                });
            }
        );
    }

    addReceptor(receptor) {
        this.receptors.push(receptor);
    }

    getAvailableReceptor() {
        const receptors = this.getAvailableReceptors();
        return receptors.size > 0 ? receptors[0] : null;
    }
    getAvailableReceptors() {
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
