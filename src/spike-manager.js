import Spike from "./spike.js";
import { getRandomItems } from "./utils.js";

export default class SpikeManager {
    constructor() {
        this.spikes = [];
    }

    toggleDirection() {
        this.spikes.forEach((spike) => spike.toggleDirection());
    }

    addSpike({ branch, direction, width = 16, color = [255, 0, 0] }, p5) {
        this.spikes.push(
            new Spike(
                {
                    width,
                    branch,
                    progress: direction === "outbound" ? 0 : branch.length,
                    direction,
                    color,
                },
                p5,
            ),
        );
    }

    removeSpike(i) {
        this.spikes.splice(i, 1);
    }

    initSpikes({ tree, direction, color = [255, 255, 0] }, p5) {
        const branches = this.getStartBranches({ tree, direction });
        branches.forEach((branch) =>
            this.addSpike({ branch, direction, color }, p5),
        );
    }

    getStartBranches({ tree, direction }) {
        return direction === "outbound"
            ? tree.branches
            : tree.getTerminalBranches();
    }

    addRandomSpikes({ tree, direction, n = 1, color = [200, 0, 0] }, p5) {
        const branches = this.getStartBranches({ tree, direction });
        getRandomItems(branches, n).forEach((branch) =>
            this.addSpike({ branch, direction, color }, p5),
        );
    }

    render(p5) {
        p5.strokeWeight(0);
        this.renderSpikes(p5);
    }

    renderSpikes(p5) {
        for (let i = this.spikes.length - 1; i >= 0; i--) {
            let spike = this.spikes[i];
            spike.move(p5);
            spike.render(p5);

            if (this.isEndOfOutboundBrach(spike)) {
                this.spawnOutboundSpikes(spike, p5, spike.color);
                this.removeSpike(i);
                continue;
            }

            if (this.isEndOfInboundBrach(spike)) {
                this.spawnInboundSpike(spike, p5, spike.color);
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

    spawnOutboundSpikes(spike, p5, color = [255, 0, 0]) {
        if (spike.branch.branches?.length) {
            const numBranches = spike.branch.branches.length;
            const scaleFactor = numBranches === 1 ? 1 : 1 - numBranches * 0.075;
            // console.log("sf:", scaleFactor);
            spike.branch.branches.forEach((b) =>
                this.addSpike(
                    {
                        width: Math.min(spike.width * scaleFactor, spike.width),
                        branch: b,
                        direction: "outbound",
                        color,
                    },
                    p5,
                ),
            );
        } else {
            // console.log("You have reached the terminal button");
            this.transferChargeAcrossSynapse(spike, p5);
        }
    }

    isEndOfInboundBrach(spike) {
        return spike.direction === "inbound" && spike.progress <= 0;
    }

    spawnInboundSpike(spike, p5, color = [255, 0, 0]) {
        if (spike.branch.parent) {
            this.addSpike(
                {
                    width: spike.width,
                    branch: spike.branch.parent,
                    direction: "inbound",
                    color,
                },
                p5,
            );
        } else {
            // transfer the charge to the connected neuron:
            // console.log("Spike reached the root");
            this.transferChargeToSoma(spike, p5);
        }
    }

    transferChargeToSoma(spike, p5) {
        const neuron = spike.branch.neuron;
        if (!neuron) {
            console.error(
                "Error: Dendrites not attached to a neuron. Logic error in setting up Neuron.",
            );
        }
        // console.log("Tranferring the charge to the Soma");
        neuron.charge += neuron.threshold / 10;
        if (neuron.charge >= neuron.threshold) {
            if (neuron.axon) {
                this.initSpikes(
                    {
                        tree: neuron.axon.tree,
                        direction: "outbound",
                        color: spike.color,
                    },
                    p5,
                );
            }
            neuron.charge = 0;
        }
    }

    transferChargeAcrossSynapse(spike, p5) {
        const terminal = spike.branch.terminal;
        if (terminal && terminal.receptor) {
            this.addSpike(
                {
                    width: spike.width,
                    branch: terminal.receptor.branch,
                    direction: "inbound",
                    color: spike.color,
                },
                p5,
            );
        }
    }
}
