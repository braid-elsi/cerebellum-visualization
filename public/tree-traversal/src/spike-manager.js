class SpikeManager {
    constructor() {
        this.spikes = [];
    }

    toggleDirection() {
        this.spikes.forEach((spike) => spike.toggleDirection());
    }

    addSpike({ branch, direction, width = 16 }) {
        this.spikes.push(
            new Spike({
                w: width,
                branch,
                progress: direction === "outbound" ? 0 : branch.length,
                direction: direction,
            }),
        );
    }

    removeSpike(i) {
        this.spikes.splice(i, 1);
    }

    initSpikes({ tree, direction }) {
        console.log(tree, direction);
        this.getStartBranches({ tree, direction }).forEach((branch) =>
            this.addSpike({ branch, direction }),
        );
    }

    getStartBranches({ tree, direction }) {
        return direction === "outbound"
            ? tree.branches
            : tree.getTerminalBranches();
    }

    addRandomSpikes({ tree, direction, n = 1 }) {
        getRandomItems(this.getStartBranches({ tree, direction }), n).forEach(
            (branch) => this.addSpike({ branch, direction }),
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

            if (this.isEndOfOutboundBrach(spike)) {
                this.spawnOutboundSpikes(spike);
                this.removeSpike(i);
                continue;
            }

            if (this.isEndOfInboundBrach(spike)) {
                this.spawnInboundSpike(spike);
                this.removeSpike(i);
            }
        }
    }

    isEndOfOutboundBrach(spike) {
        return (
            spike.direction === "outbound" &&
            spike.progress >= spike.branch.length
        );
    }

    spawnOutboundSpikes(spike) {
        if (spike.branch.branches?.length) {
            spike.branch.branches.forEach((b) =>
                this.addSpike({
                    width: spike.w,
                    branch: b,
                    direction: "outbound",
                }),
            );
        } else {
            console.log("You have reached the terminal button");
        }
    }

    isEndOfInboundBrach(spike) {
        return spike.direction === "inbound" && spike.progress <= 0;
    }

    spawnInboundSpike(spike) {
        if (spike.branch.parent) {
            this.addSpike({
                width: spike.w,
                branch: spike.branch.parent,
                direction: "inbound",
            });
        } else {
            console.log("Spike reached the root");
            // time to pass on the spikes:
            const neuron = spike.branch.neuron;
            if (!neuron) {
                return;
            }
            neuron.charge += neuron.threshold / 10;
            if (neuron.charge >= neuron.threshold) {
                this.initSpikes({
                    tree: neuron.axon.tree,
                    direction: "outbound",
                });
                neuron.charge = 0;
            }
        }
    }
}
