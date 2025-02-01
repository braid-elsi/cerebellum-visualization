/* 
Factors Affecting Signal Transmission Along Mossy Fibers:

1. Branching and Cable Properties:
   The mossy fiber branches act like an electrical cable, and signals traveling along these branches are subject to attenuation (loss of signal strength) due to the electrical resistance and capacitance of the axonal membrane.

   Distance matters: The farther a branch point is from the main axon, the more the signal may diminish before reaching it.

2. Synaptic Properties:
    Synapse size and strength: Some synapses are stronger than others, meaning they release more neurotransmitter in response to an incoming action potential.

    Release probability: The probability of neurotransmitter release at each synapse can vary, leading to differences in the postsynaptic response.

3. Local Input Resistance of the Granule Cell Dendrite:
    Granule cell dendrites vary in their resistance to electrical currents. Higher resistance can lead to a stronger response to the same amount of charge, while lower resistance leads to a weaker response.

4. Branch Point Filtering:
    The geometry of the mossy fiber branches can affect how electrical signals propagate. At each branch point, some signal energy may dissipate, so the strength of the signal may decrease as it propagates to further branches.

*/

export default class Pulse {
    constructor({ neuron }) {
        console.log(neuron);
        this.polylines = neuron.axon ? neuron.axon.polylines : [];
        this.signalPos = 0;
        this.i = 0;
        this.j = 0;
        // this.color = [156, 252, 151];
        this.color = [99, 255, 0];
    }

    isValidAxon() {
        if (this.polylines.length === 0) {
            console.log("first");
            return false;
        }
        if (!this.polylines[this.i]) {
            console.log("second");
            return false;
        }
        if (this.polylines[this.i].length === 0) {
            console.log("third");
            return false;
        }
        if (!this.polylines[this.i][this.j]) {
            console.log("fourth");
            return false;
        }
        return true;
    }

    getNextLine() {
        if (this.j < this.polylines[this.i].length - 1) {
            this.j++;
        } else if (this.i < this.polylines.length - 1) {
            this.j = 0;
            this.i++;
        } else {
            console.log("done!");
            this.i = 0;
            this.j = 0;
        }
        // return this.polylines[this.i][this.j];
    }

    render(p) {
        if (!this.isValidAxon()) {
            console.log("invalid axon");
            return;
        }
        // console.log(this.polylines, this.i, this.j, this.signalPos);
        if (this.signalPos > 1) {
            console.log("get next line...");
            this.getNextLine();
            this.signalPos = 0;
        }
        const line = this.polylines[this.i][this.j];

        const { start, end } = line;

        if (this.signalPos > 1) {
            this.signalPos = 0;
        }
        // p.stroke(...this.color);
        p.fill(...this.color);
        let x = p.lerp(start.x, end.x, this.signalPos);
        let y = p.lerp(start.y, end.y, this.signalPos);
        p.ellipse(x, y, 15, 15);
        this.signalPos += 0.01;
    }
}
