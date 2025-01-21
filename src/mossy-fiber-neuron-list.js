import MossyFiberNeuron from "./mossy-fiber-neuron.js";
import config from "./config.js";
import { drawLabel, getYPositionAbs } from "./utils.js";

export default class MossyFiberNeuronList {
    mfNeurons = [];
    constructor(brainstemLayer, granuleCellList) {
        let { color, cellParams, label } = config.mossyFiberCells;
        this.label = label;
        this.layer = brainstemLayer;
        for (const props of cellParams) {
            let { id, x, y, width, connectsTo } = props;
            y = getYPositionAbs(y, this.layer);

            const opts = {
                id: id,
                x: x,
                y: y,
                w: width,
                connectsTo: connectsTo,
                granuleCellList: granuleCellList,
                color: color,
            };
            const mfNeuron = new MossyFiberNeuron(opts);
            this.mfNeurons.push(mfNeuron);
        }
    }

    getCells() {
        return this.mfNeurons;
    }

    render(p5) {
        this.mfNeurons.forEach((mfNeuron) => {
            mfNeuron.render(p5);
        });
        drawLabel(p5, this.label, this.layer);
    }
}
