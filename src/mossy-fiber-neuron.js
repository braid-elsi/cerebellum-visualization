import MossyFiberAxon from "./mossy-fiber-axon.js";

export default class MossyFiberNeuron {
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
        x,
        y,
        w,
        connectsTo,
        granuleCellList,
        color = [44, 201, 255],
    }) {
        // console.log("MFN:", id, x, y, w, color);
        this.id = id;
        this.x = x;
        this.y = y;
        this.w = w;
        this.connectsTo = connectsTo;
        this.granuleCellList = granuleCellList;
        this.color = color;
        this.axon = new MossyFiberAxon(this, this.granuleCellList);
    }

    render(p) {
        p.stroke(...this.color);
        p.fill(...this.color);
        p.ellipse(this.x, this.y, this.w, this.w); // Granule cell bodies

        this.axon.render(p);
    }
}
