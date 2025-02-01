export default class Dendrites {
    constructor({ neuron }) {
        this.neuron = neuron;
        this.receptors = [];
    }

    addReceptor(receptor) {
        this.receptors.push(receptor);
    }

    render(p5) {
        for (const receptor of this.receptors) {
            receptor.render(p5);
        }
    }
}
