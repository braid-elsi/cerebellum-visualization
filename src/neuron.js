import { getRandomInt, dist1 } from "./utils.js";
import { JSONTreeLoader, RandomTreeGenerator } from "./tree.js";
import { Receptor, Terminal } from "./synapses.js";

class Dendrites {
    constructor({ neuron, tree }) {
        this.tree = tree;
        this.neuron = neuron;

        // connect the roots of the dendrite trees to the source neuron
        this.tree.branches.forEach((branch) => (branch.neuron = neuron));

        const receptorBranches = this.tree.getTerminalBranches();
        this.receptors = receptorBranches.map((branch) => {
            return new Receptor({
                width: 20,
                branch: branch,
            });
        });
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
        this.terminals = terminals || this.generateTerminals();
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

    render(p5) {
        this.tree.render(p5);
        this.terminals.forEach((terminal) => terminal.render(p5));
    }
}

export class Neuron {
    constructor({ x, y, width, maxBranches = 2, maxLevel = 3 }) {
        if (x === undefined || y === undefined || width === undefined) {
            throw new Error("x, y, and width are required parameters.");
        }
        Object.assign(this, { x, y, width });
        this.charge = 0;
        this.threshold = width;
        this.generateDendrites();
    }

    generateAxon() {
        this.axon = new Axon({
            tree: RandomTreeGenerator.generate({
                startX: this.x,
                startY: this.y,
                maxLevel: this.maxLevel, // Use class properties
                maxBranches: this.maxBranches,
                angle: -Math.PI / 2,
            }),
        });
    }

    generateDendrites(maxBranches = 2, maxLevel = 3) {
        const tree = RandomTreeGenerator.generate({
            startX: this.x,
            startY: this.y,
            maxLevel: maxLevel,
            maxBranches: maxBranches,
            angle: Math.PI / 2,
        });
        // this.dendrites.branches.forEach((branch) => (branch.neuron = this));
        this.dendrites = new Dendrites({ neuron: this, tree });
    }

    render(p5) {
        this.charge = Math.max(0, this.charge - 0.005);
        this.axon.render(p5);
        this.dendrites.render(p5);
        p5.ellipse(this.x, this.y, this.width, this.width);
        p5.fill(255, 0, 0);
        p5.ellipse(this.x, this.y, this.charge, this.charge);
    }
}

export class GranuleCell extends Neuron {
    generateDendrites() {
        const points = [];
        const numPoints = getRandomInt(3, 5);
        const radius = this.width;
        const angleRange = (2 * Math.PI) / 3;
        const delta = angleRange / (numPoints - 1);
        for (let i = 0; i < numPoints; i++) {
            let angle = delta * i + angleRange / 4; // Divide full circle into equal angles
            let x = this.x + radius * Math.cos(angle);
            let y = this.y + radius * Math.sin(angle);
            points.push({
                start: { x: this.x, y: this.y },
                end: { x: x, y: y },
                level: 0,
            });
        }
        const tree = JSONTreeLoader.fromJSON(points);
        // // attach the neuron to the root branch for the tree traversal:
        // this.dendrites.branches.forEach((branch) => (branch.neuron = this));
        this.dendrites = new Dendrites({ neuron: this, tree });
    }

    generateAxon(targetCells) {
        if (!targetCells) {
            const tree = RandomTreeGenerator.generate({
                startX: this.x,
                startY: this.y,
                maxLevel: 2,
                maxBranches: 1,
                angle: -Math.PI / 2,
            });
            this.axon = new Axon({ tree });
            return;
        }

        console.log(targetCells);
        let branchJSON = [];
        for (const targetCell of targetCells) {
            branchJSON.push(...this.generateBranchJSON(targetCell));
        }
        const tree = JSONTreeLoader.fromJSON(branchJSON);
        this.axon = new Axon({ tree });
        for (const targetCell of targetCells) {
            // this doesn't work b/c every terminal only has one receptor and
            // both neurons are trying to attach to all of the available receptors.
            // the solution is to ensure that the target terminals are the argument,
            // not the entire cell:
            this.attachTerminalsToReceptors(targetCell);
        }
    }

    getClosestReceptor(terminal, receptors) {
        return receptors.reduce(
            (closest, receptor) =>
                dist1(terminal.x, terminal.y, receptor.x, receptor.y) <
                dist1(terminal.x, terminal.y, closest.x, closest.y)
                    ? receptor
                    : closest,
            receptors[0],
        );
    }

    attachTerminalsToReceptors(targetCell) {
        const receptors = targetCell.dendrites.receptors;
        this.axon.terminals.forEach((terminal) => {
            terminal.setReceptor(this.getClosestReceptor(terminal, receptors));
        });
    }

    generateBranchJSON(targetCell) {
        // aim for target cell:
        const points = [];
        const mfX = this.x;
        const mfY = this.y;
        const branchY = targetCell.dendrites.getReceptorMaxY(); //targetCell.y
        // const branchX = targetCell.dendrites.getReceptorMaxX(); //targetCell.x
        // console.log(branchX);
        const y2 = branchY.y + 3 * targetCell.width;
        let x2 = ((targetCell.x - mfX) / 5) * 4 + mfX;
        let level = 0;

        // level 1:
        points.push({
            start: { x: mfX, y: mfY },
            end: { x: x2, y: y2 },
            level: level,
        });
        ++level;

        // level 2:
        const receptors = targetCell.dendrites.receptors;
        for (const receptor of receptors) {
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
}
