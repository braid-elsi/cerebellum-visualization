import MossyFiberNeuron from "./mossy-fiber-neuron.js";
import config from "./config.js";

export default class MossyFiberNeuronList {
    mfNeurons = [];
    constructor(brainstemLayer, granuleCellList) {
        console.log(granuleCellList);
        let { color, cellParams } = config.mossyFiberCells;
        const bounds = brainstemLayer.getBounds();
        for (const props of cellParams) {
            let { id, x, y, width, connectsTo } = props;
            y = bounds.y1 + y * (bounds.y2 - bounds.y1);

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
        console.log(this.mfNeurons);
        this.mfNeurons.forEach((mfNeuron) => {
            mfNeuron.render(p5);
        });
    }
}
