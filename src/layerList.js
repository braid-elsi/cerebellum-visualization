import Layer from "./layer.js";

export default class LayerList {
    constructor(screenW, screenH) {
        let y = screenH;
        let w = screenW;
        let h = screenH / 5;
        this.brainstemLayer = new Layer(y, w, h, "Brainstem / Spinal Cord");
        this.whiteMatterLayer = new Layer(y - h, w, h, "White matter");
        this.granuleLayer = new Layer(y - 2 * h, w, h, "Granule layer");
        this.purkinjeLayer = new Layer(y - 3 * h, w, h, "Purkinje layer");
        this.molecularLayer = new Layer(y - 4 * h, w, h, "Molecular layer");
    }

    getLayers() {
        return [
            this.molecularLayer,
            this.purkinjeLayer,
            this.granuleLayer,
            this.whiteMatterLayer,
            this.brainstemLayer,
        ];
    }

    render(p) {
        this.getLayers().forEach((layer) => layer.render(p));
    }
}
