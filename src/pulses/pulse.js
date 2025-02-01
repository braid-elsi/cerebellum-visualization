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
        this.neuron = neuron;
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
    }

    render(p5, advance = true) {
        if (!this.isValidAxon()) {
            // Inferior Olive and Cerebellar Nuclei are problematic right now.
            // TODO!
            // console.log("invalid axon:", this.neuron);
            return;
        }
        if (advance) {
            this.move();
        }
        this.draw(p5);
    }

    move() {
        // console.log(this.polylines, this.i, this.j, this.signalPos);
        if (this.signalPos > 1) {
            console.log("getting next line...");
            this.getNextLine();
            this.signalPos = 0;
        }
        if (this.signalPos > 1) {
            this.signalPos = 0;
        }
        this.signalPos += 0.01;
    }

    draw(p5) {
        const line = this.polylines[this.i][this.j];
        const { start, end } = line;
        p5.fill(...this.color);
        let x = p5.lerp(start.x, end.x, this.signalPos);
        let y = p5.lerp(start.y, end.y, this.signalPos);
        p5.ellipse(x, y, 15, 15);
    }
}
