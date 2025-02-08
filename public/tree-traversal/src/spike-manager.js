class SpikeManager {
    constructor(direction) {
        if (!["outbound", "inbound"].includes(direction)) {
            throw new Error(
                "SpikeManager requires a direction of 'inbound' or 'outbound'.",
            );
        }
        this.spikes = [];
        this.direction = direction;
    }

    toggleDirection() {
        this.direction = this.direction === "outbound" ? "inbound" : "outbound";
        this.spikes.forEach((spike) => spike.toggleDirection());
    }

    addSpike({ branch, width = 16 }) {
        this.spikes.push(
            new Spike({
                w: width,
                branch,
                progress: this.direction === "outbound" ? 0 : branch.length,
                direction: this.direction,
            }),
        );
    }

    removeSpike(i) {
        this.spikes.splice(i, 1);
    }

    initSpikes(tree) {
        this.getStartBranches(tree).forEach((branch) =>
            this.addSpike({ branch }),
        );
    }

    getStartBranches(tree) {
        return this.direction === "outbound"
            ? tree.branches
            : tree.getTerminalBranches();
    }

    addRandomSpikes(tree, n = 1) {
        getRandomItems(this.getStartBranches(tree), n).forEach((branch) =>
            this.addSpike({ branch }),
        );
    }

    render() {
        strokeWeight(0);
        this.renderSpikes();
    }

    renderSpikes() {
        for (let i = this.spikes.length - 1; i >= 0; i--) {
            let spike = this.spikes[i];
            spike.move();
            spike.render();

            if (
                this.direction === "outbound" &&
                spike.progress >= spike.branch.length
            ) {
                spike.branch.branches?.forEach((b) =>
                    this.addSpike({ width: spike.w * 0.9, branch: b }),
                );
                console.log(
                    spike.branch.branches
                        ? ""
                        : "you have reached the terminal button",
                );
                this.removeSpike(i);
            } else if (this.direction === "inbound" && spike.progress <= 0) {
                if (spike.branch.parent) {
                    this.addSpike({
                        width: spike.w * 0.9,
                        branch: spike.branch.parent,
                    });
                } else {
                    console.log("Spike reached the root");
                }
                this.removeSpike(i);
            }
        }
    }
}
