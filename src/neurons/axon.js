import { Terminal } from "../synapses.js";
import { logBase } from "../utils.js";

export default class Axon {
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
            const terminal = new Terminal({
                width: 20,
                branch,
                color: this.neuron.color,
            });
            branch.terminal = terminal;
            return terminal;
        });
    }

    addTerminal(width, branch, receptor = null) {
        const terminal = new Terminal({
            width,
            branch,
            color: this.neuron.color,
        });
        branch.terminal = terminal;
        this.terminals.push(terminal);
        terminal.setReceptor(receptor);
        return terminal;
    }

    render(p5) {
        p5.stroke(...this.neuron.color);
        this.tree.render(p5);
        this.terminals.forEach((terminal) => terminal.render(p5));
    }
}
