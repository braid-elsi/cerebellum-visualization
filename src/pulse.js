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
    constructor(x1, y1, x2, y2, color = [255, 0, 0], signalPos) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
        this.color = color;
        this.signalPos = signalPos;
    }

    render(p) {
        if (this.signalPos > 1) {
            this.signalPos = 0;
        }
        p.stroke(...this.color);
        p.fill(...this.color);
        let x = p.lerp(this.x1, this.x2, this.signalPos);
        let y = p.lerp(this.y1, this.y2, this.signalPos);
        p.ellipse(x, y, 8, 8);
        this.signalPos += 0.01;
    }
}
