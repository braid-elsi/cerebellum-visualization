class Neuron {
    constructor({ x, y, width }) {
        Object.assign(this, { x, y, width });
        this.charge = 0;
        this.threshold = width;
        this.generateDendrites();
    }

    generateAxon() {
        this.axon = TreeUtils.generateRandomTree({
            startX: this.x,
            startY: this.y,
            maxLevel: 3,
            maxBranches: 2,
            angle: PI / 2,
        });
    }

    generateDendrites() {
        this.dendrites = TreeUtils.generateRandomTree({
            startX: this.x,
            startY: this.y,
            maxLevel: 7,
            maxBranches: 2,
            angle: -PI / 2,
        });
        this.dendrites.branches.forEach((branch) => (branch.neuron = this));
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
        this.dendrites = TreeUtils.generateStaticTree({
            startX: this.x,
            startY: this.y,
            maxLevel: 1,
            numBranches: 3,
            angle: PI / 2,
        });
        // attach the neuron to the root branch for the tree traversal:
        this.dendrites.branches.forEach((branch) => (branch.neuron = this));
    }

    generateAxon() {
        this.axon = TreeUtils.generateRandomTree({
            startX: this.x,
            startY: this.y,
            maxLevel: 2,
            maxBranches: 1,
            angle: -PI / 2,
        });
    }
}
