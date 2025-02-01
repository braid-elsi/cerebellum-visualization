import Axon from "./axon.js";

export default class PurkinjeCellAxon extends Axon {
    constructor({ source, target, axonWidth = 4 }) {
        super({
            source,
            targetCells: [target],
            axonWidth,
        });
        this.generateSynapses();
    }

    generateSynapses() {
        for (const target of this.targetCells) {
            const y2 = target.y - target.height / 2 - this.axonWidth;
            this.polylines.push([
                {
                    start: { x: this.source.x, y: this.source.y },
                    end: { x: target.x, y: y2 },
                },
            ]);

            this.receptors.push({
                x: target.x,
                y: y2,
                width: this.axonWidth * 3,
                height: this.axonWidth,
            });
        }
    }
}
