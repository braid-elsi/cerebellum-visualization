import Cell from "./cell.js";
import MossyFiberAxon from "./mossy-fiber-axon.js";

export default class MossyFiberNeuron extends Cell {
    /**
     * https://www.youtube.com/watch?v=QUkwqAaSrUg
     * Mossy fibers (dendrites that come from the motor cortex and the spinal cord).
     * The carry to kinds of relevant signals:
     *  1. Motor commands that have just been issued to the muscles
     *  2. Sensory feedback from the muscles and other sensory organs
     * Mossy fibers synapse onto granule cells and onto "deep cerebellar nuclei".
     * Mossy fibers "project diffusely" onto a large number of granule cells.
     */

    signalPos = 0;

    constructor({
        id,
        cellType,
        x,
        y,
        width,
        height,
        color = [44, 201, 255],
        layer,
        connectsTo,
        granuleCellList,
    }) {
        super({
            id,
            x,
            y,
            height,
            width,
            cellType,
            color,
            layer,
        });
        this.connectsTo = connectsTo;
        this.granuleCellList = granuleCellList;
        this.axon = new MossyFiberAxon(this, this.granuleCellList);
    }

    render(p5) {
        super.render(p5);
        this.axon.render(p5);
    }
}
