import Cell from "./cell.js";
import GranuleDentriteReceptor from "./dendrites-gc.js";
import GranuleCellAxon from "./axon-gc.js";

export default class GranuleCell extends Cell {
    constructor({
        id,
        cellType,
        x,
        y,
        width,
        height,
        layer,
        numReceptors = 4,
        color = [98, 104, 190],
        axonWidth = 3,
    }) {
        // Cell constructor:
        super({ id, x, y, height, width, cellType, color, layer });

        // Additional Logic:
        this.receptors = [];
        this.axonWidth = axonWidth;

        let start = (7 / 8) * Math.PI;
        let end = (1 / 8) * Math.PI;
        let interval = Math.abs(start - end) / (numReceptors - 1);

        for (let i = 0; i < numReceptors; i++) {
            this.receptors.push(
                new GranuleDentriteReceptor(
                    this,
                    (7 / 8) * Math.PI - i * interval,
                    this.width * 1.3,
                    this.height / 2
                )
            );
        }
    }

    addAxon(molecularLayer) {
        this.axon = new GranuleCellAxon({
            source: this,
            molecularLayer: molecularLayer,
            axonWidth: this.axonWidth,
        });
    }

    // render(p5) {
    //     super.render(p5);

    // }
}
