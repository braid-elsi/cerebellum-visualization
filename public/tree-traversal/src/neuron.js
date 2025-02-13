class Dendrites {
    constructor({ neuron, tree }) {
        this.tree = tree;

        // connect the roots of the dendrite trees to the source neuron
        this.tree.branches.forEach((branch) => (branch.neuron = neuron));

        const receptorBranches = this.tree.getTerminalBranches();
        // console.log(receptorBranches);
        // this.receptors = finalBranches.map((branch) => branch.receptor);
        this.receptors = receptorBranches.map((b) => {
            return new Receptor({
                x: Math.round(b.end.x),
                y: Math.round(b.end.y),
                w: 20,
                angle: b.angle,
            });
        });
    }

    render() {
        this.tree.render();
        this.receptors.forEach((receptor) => receptor.render());
    }
}

class Axon {
    constructor({ tree }) {
        this.tree = tree;
        const terminalBranches = this.tree.getTerminalBranches();
        console.log(terminalBranches);

        // connect the roots of the dendrite trees to the source neuron

        this.terminals = [];
        terminalBranches.forEach((b) => {
            const terminal = new Terminal({
                x: Math.round(b.end.x),
                y: Math.round(b.end.y),
                w: 20,
                angle: b.angle,
            });
            this.terminals.push(terminal);
            // give the terminal branch access to the terminal
            b.terminal = terminal;
        });
    }

    render() {
        this.tree.render();
        // console.log(this.terminals);
        this.terminals.forEach((terminal) => terminal.render());
    }
}

class Neuron {
    constructor({ x, y, width }) {
        Object.assign(this, { x, y, width });
        this.charge = 0;
        this.threshold = width;
        this.generateDendrites();
    }

    generateAxon() {
        const tree = RandomTreeGenerator.generate({
            startX: this.x,
            startY: this.y,
            maxLevel: 3,
            maxBranches: 2,
            angle: -PI / 2,
        });
        this.axon = new Axon({ tree });
    }

    generateDendrites() {
        const tree = RandomTreeGenerator.generate({
            startX: this.x,
            startY: this.y,
            maxLevel: 7,
            maxBranches: 2,
            angle: PI / 2,
        });
        // this.dendrites.branches.forEach((branch) => (branch.neuron = this));
        this.dendrites = new Dendrites({ neuron: this, tree });
    }

    render() {
        this.charge = Math.max(0, this.charge - 0.05);
        this.axon.render();
        this.dendrites.render();
        ellipse(this.x, this.y, this.width, this.width);
        fill(255, 0, 0);
        ellipse(this.x, this.y, this.charge, this.charge);
    }
}

class GranuleCell extends Neuron {
    generateDendrites() {
        const points = [];
        const numPoints = getRandomInt(3, 5);
        const radius = this.width;
        const angleRange = (2 * PI) / 3;
        const delta = angleRange / (numPoints - 1);
        for (let i = 0; i < numPoints; i++) {
            let angle = delta * i + angleRange / 4; // Divide full circle into equal angles
            let x = this.x + radius * cos(angle);
            let y = this.y + radius * sin(angle);
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

    generateAxon(targetCell) {
        if (!targetCell) {
            const tree = RandomTreeGenerator.generate({
                startX: this.x,
                startY: this.y,
                maxLevel: 2,
                maxBranches: 1,
                angle: -PI / 2,
            });
            this.axon = new Axon({ tree });
            return;
        }

        // aim for target cell:
        const points = [];
        const mfX = this.x;
        const mfY = this.y;
        const y2 = targetCell.y + 3 * targetCell.width;
        let x2 = ((targetCell.x - mfX) / 5) * 4 + mfX;
        let level = 0;
        // vertical line:
        points.push({
            start: { x: mfX, y: mfY },
            end: { x: mfX, y: y2 },
            level: level,
        });
        ++level;

        if (mfX != x2) {
            // angled line to cell:
            points.push({
                start: { x: mfX, y: y2 },
                end: { x: x2, y: y2 },
                level: level,
            });
            ++level;
        }

        // angled line to each receptor:
        const receptors = targetCell.dendrites.receptors;
        for (const receptor of receptors) {
            const synapseGapWidth = receptor.w / 3;
            points.push({
                start: { x: x2, y: y2 },
                end: {
                    x: receptor.x,
                    y: receptor.y + synapseGapWidth,
                },
                level: level,
            });
        }
        console.log("Axon points:", points);
        const tree = JSONTreeLoader.fromJSON(points);
        console.log("Axon tree:", tree);
        this.axon = new Axon({ tree });
        console.log("Axon:", this.axon);
    }
}
