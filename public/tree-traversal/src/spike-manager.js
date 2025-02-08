class SpikeManager {
    constructor(direction) {
        if (!["outbound", "inbound"].includes(direction)) {
            throw new Error(
                "SpikeManager requires a direction argument of either 'inbound' or 'outbound'. Please check your SpikeManager initializedion.",
            );
        }
        this.spikes = [];
        this.direction = direction;
    }

    isOutbound() {
        return this.direction === "outbound";
    }

    isInbound() {
        return this.direction === "inbound";
    }

    toggleDirection() {
        this.direction = this.isOutbound() ? "inbound" : "outbound";
        this.spikes.forEach((spike) => spike.toggleDirection());
    }

    addSpike({ branch, width = 16 }) {
        const spike = new Spike({
            w: width,
            branch: branch,
            progress: this.isOutbound() ? 0 : branch.length,
            direction: this.direction,
        });
        this.spikes.push(spike);
    }

    removeSpike(i) {
        this.spikes.splice(i, 1);
    }

    initSpikes(tree) {
        let branches = this.getStartBranches(tree);
        for (const branch of branches) {
            this.addSpike({
                width: 16,
                branch: branch,
            });
        }
    }

    getStartBranches(tree) {
        if (this.isOutbound()) {
            return tree.branches;
        } else {
            return tree.getTerminalBranches();
        }
    }

    addRandomSpikes(tree, n = 1) {
        let branches = this.getStartBranches(tree);
        // get a random selection of branches:
        branches = getRandomItems(branches, n);
        branches.map((b) => spikeManager.addSpike({ width: 16, branch: b }));
    }

    render() {
        strokeWeight(0);
        if (this.isOutbound()) {
            this.renderOutboundSpike();
        } else {
            this.renderInboundSpike();
        }
    }

    renderInboundSpike() {
        for (let i = this.spikes.length - 1; i >= 0; i--) {
            let spike = this.spikes[i];
            let branch = spike.branch;

            // move spike:
            spike.move();
            spike.render();

            // Move to parent branch when reaching the start:
            if (spike.progress <= 0) {
                // let parentBranch = this.findParentBranch(branch);
                if (branch.parent) {
                    this.spikes.push(
                        new Spike({
                            w: spike.w * 0.9,
                            branch: branch.parent,
                            progress: branch.parent.length,
                            direction: this.direction,
                        }),
                    );
                } else {
                    console.log("Spike reached the root");
                }
                this.spikes.splice(i, 1);
            }
        }
    }

    renderOutboundSpike() {
        // decrementing prevents index shifting issues
        // when removing spikes from the array.
        for (let i = this.spikes.length - 1; i >= 0; i--) {
            let spike = this.spikes[i];
            let branch = spike.branch;

            // move spike:
            spike.move();
            spike.render();

            // create new spikes to follow the child branches:
            if (spike.progress >= branch.length) {
                if (branch.branches) {
                    for (let b of branch.branches) {
                        this.addSpike({
                            width: spike.w * 0.9,
                            branch: b,
                        });
                    }
                } else {
                    console.log("you have reached the terminal button");
                }
                // remove expired spike:
                this.removeSpike(i);
            }
        }
    }
}
