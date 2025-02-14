import Neuron from "./neuron.js";
import Receptor from "../dendrites/receptor.js";
import GranuleCellAxon from "../axons/axon-granule-cell.js";
import Dendrites from "../dendrites/dendrites.js";

export default class GranuleCell extends Neuron {
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
        this.axonWidth = axonWidth;

        let start = (7 / 8) * Math.PI;
        let end = (1 / 8) * Math.PI;
        let interval = Math.abs(start - end) / (numReceptors - 1);
        this.dendrites = new Dendrites({ neuron: this });

        for (let i = 0; i < numReceptors; i++) {
            this.dendrites.addReceptor(
                new Receptor({
                    neuron: this,
                    angle: (7 / 8) * Math.PI - i * interval,
                    length: this.width * 1.3,
                    receptorLength: this.height / 2,
                }),
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
}
