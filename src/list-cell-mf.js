import MossyFiberNeuron from "./cell-mf.js";
import config from "./config.js";

export default class MossyFiberNeuronList {
    mfNeurons = [];
    constructor(brainstemLayer) {
        let { color, cellType, cellParams } = config.mossyFiberCells;
        for (const props of cellParams) {
            let { id, x, y, width, height, connectsTo } = props;
            const opts = {
                id,
                x,
                y,
                width,
                height,
                color: color,
                cellType: cellType,
                layer: brainstemLayer,
                connectsTo,
            };
            const mfNeuron = new MossyFiberNeuron(opts);
            this.mfNeurons.push(mfNeuron);
        }
    }

    getCells() {
        return this.mfNeurons;
    }
}
