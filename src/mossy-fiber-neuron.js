import Axon from "./axon";

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

    constructor(
        p,
        x1,
        y1,
        x2 = 400,
        y2 = 450,
        signalPos = 0,
        w = 5,
        colorSoma = [50, 200, 50],
        colorMossyFiber = [200, 50, 50]
    ) {
        this.p = p;
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.w = w;
        this.colorSoma = colorSoma;
        this.colorMossyFiber = colorMossyFiber;
        this.signalPos = signalPos;
        this.axon = new Axon(x1, y1, x2, y2, colorMossyFiber, signalPos);
        this.render();
    }

    render() {
        this.p.stroke(...this.colorSoma);
        this.p.fill(...this.colorSoma);
        this.p.ellipse(this.x1, this.y1, this.w, this.w); // Granule cell bodies

        this.axon.render(this.p);
    }
}
