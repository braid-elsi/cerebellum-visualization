import Neuron from "./base.js";
import Axon from "./axon.js";
import Dendrites from "./dendrites.js";
import { Branch } from "../branch.js";

export default class DeepCerebellarNuclei extends Neuron {
    constructor({ x, y, width, color }) {
        super({ x, y, width, color });
        this.type = "dcn";
    }

    async generateDendrites(numBranches = 2, maxLevel = 9) {
        // Generate a dendritic tree based on number of connections
        const tree = PurkinjeTreeGenerator.generate({
            x: this.x,
            y: this.y,
            numBranches,
            maxLevel: 4,
            numBranches: numBranches,
            angle: -Math.PI / 2,
            yMax: this.y,
        });

        const dendriteOptions = {
            neuron: this,
            tree,
            receptorOptions: {
                width: 8,
                height: 3,
                doRotation: true,
                color: this.color,
            },
        };
        this.dendrites = new Dendrites(dendriteOptions);
    }

    generateAxon(topY) {
        topY = topY || getRandomInt(5, 300);
        const vertical = new Branch({
            start: { x: this.x, y: this.y },
            end: { x: this.x, y: topY },
            level: 0,
            parent: null,
        });
        const left = new Branch({
            start: { x: this.x, y: topY },
            end: { x: 0, y: topY },
            level: 1,
            parent: vertical,
        });
        const right = new Branch({
            start: { x: this.x, y: topY },
            end: { x: 2000, y: topY },
            level: 1,
            parent: vertical,
        });

        this.axon = new Axon({ neuron: this, tree: new Tree([vertical]) });
        this.axon.tree.addBranch(left, vertical);
        this.axon.tree.addBranch(right, vertical);
    }

    render(p5) {
        this.charge = Math.max(0, this.charge - 0.015);

        p5.strokeWeight(0);
        if (this.axon) {
            this.axon.render(p5);
        }
        if (this.dendrites) {
            this.dendrites.render(p5);
        }
        const radius = this.width / 3;
        p5.fill(...this.color);
        p5.rect(
            this.x,
            this.y,
            this.width,
            this.width * 0.6,
            radius,
            radius,
            radius,
            radius,
        );
        p5.fill(0, 200, 200);
        p5.ellipse(this.x, this.y, this.charge, this.charge);
    }
}
