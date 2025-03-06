import { Terminal } from "../synapses.js";
import { logBase } from "../utils.js";

export default class Axon {
    constructor({ neuron, tree, terminals = null, strokeWidth=3 }) {
        this.tree = tree;
        this.terminals = [];
        this.neuron = neuron;
        this.strokeWidth = strokeWidth;
        // this.terminals = terminals || this.generateTerminals();
    }

    generateTerminals() {
        const terminalBranches = this.tree.getTerminalBranches();

        // connect the roots of the dendrite trees to the source neuron
        return terminalBranches.map((branch) => {
            const terminal = ({
                width: 20,
                branch,
                color: this.neuron.color,
            });
            branch.terminal = terminal;
            return terminal;
        });
    }

    addTerminal({width, height, branch, receptor = null, doRotation = false}) {
        const terminal = new Terminal({
            width,
            height,
            branch,
            color: this.neuron.color,
            doRotation
        });
        branch.terminal = terminal;
        this.terminals.push(terminal);
        terminal.setReceptor(receptor);
        return terminal;
    }

    render(p5) {
        // console.log(this.strokeWidth);
        p5.strokeWeight(this.strokeWidth)
        p5.stroke(...this.neuron.color);
        this.tree.render(p5);
        this.terminals.forEach((terminal) => terminal.render(p5));
    }
}
