class Dendrites {
    constructor({ neuron, tree }) {
        this.tree = tree;

        // connect the roots of the dendrite trees to the source neuron
        this.tree.branches.forEach((branch) => (branch.neuron = neuron));

        const receptorBranches = this.tree.getTerminalBranches();
        console.log(receptorBranches);
        // this.receptors = finalBranches.map((branch) => branch.receptor);
        this.receptors = receptorBranches.map((b) => {
            return new Terminal({
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
        this.terminals = terminalBranches.map((b) => {
            return new Terminal({
                x: Math.round(b.end.x),
                y: Math.round(b.end.y),
                w: 20,
                angle: b.angle,
            });
        });
    }

    render() {
        this.tree.render();
        console.log(this.terminals);
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
            angle: PI / 2,
        });
        this.axon = new Axon({ tree });
    }

    generateDendrites() {
        const tree = RandomTreeGenerator.generate({
            startX: this.x,
            startY: this.y,
            maxLevel: 7,
            maxBranches: 2,
            angle: -PI / 2,
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
        const tree = StaticTreeGenerator.generate({
            startX: this.x,
            startY: this.y,
            maxLevel: 1,
            numBranches: 3,
            angle: PI / 2,
        });
        // // attach the neuron to the root branch for the tree traversal:
        // this.dendrites.branches.forEach((branch) => (branch.neuron = this));
        this.dendrites = new Dendrites({ neuron: this, tree });
    }

    generateAxon() {
        const tree = RandomTreeGenerator.generate({
            startX: this.x,
            startY: this.y,
            maxLevel: 2,
            maxBranches: 1,
            angle: -PI / 2,
        });
        this.axon = new Axon({ tree });

        // Define leaf positions (randomly placed)
        // let leaves = [];
        // for (let i = 0; i < numPoints; i++) {
        //     let x = 100 + i * 50;
        //     let y = 150 + i * 6;
        //     leaves.push(createVector(x, y));
        // }

        // // Define trunk position (final endpoint)
        // let trunk = createVector((numPoints * 50 + 100) / 2 + 25, 500);

        // // Create tree and generate branches
        // let tree = LeafTreeGenerator.generate({
        //     leaves,
        //     trunk,
        //     levels: numLevels,
        //     branchFactor: branchesPerCluster,
        // });
    }
}
