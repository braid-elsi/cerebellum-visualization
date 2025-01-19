import Layer from "./layer.js";

const layerConfig = {
    brainstemLayer: {
        heightFraction: 0.15,
        label: "Brainstem / Spinal Cord",
        color: [249, 242, 250],
    },
    whiteMatterLayer: {
        heightFraction: 0.1,
        label: "White matter",
        color: [255, 255, 255],
    },
    granuleLayer: {
        heightFraction: 0.3,
        label: "Granule layer",
        color: [249, 242, 250],
    },
    purkinjeLayer: {
        heightFraction: 0.1,
        label: "Purkinje layer",
        color: [255, 255, 255],
    },
    molecularLayer: {
        heightFraction: 0.35,
        label: "Molecular layer",
        color: [249, 242, 250],
    },
};

export default class LayerList {
    constructor(screenW, screenH) {
        let y = screenH;
        let w = screenW;
        // let h = screenH / 5;
        for (const key in layerConfig) {
            const { heightFraction, label, color } = layerConfig[key];
            const h = heightFraction * screenH;
            this[key] = new Layer(y, w, h, label, color);
            y -= h;
        }
        // this.brainstemLayer = new Layer(y, w, h, "Brainstem / Spinal Cord");
        // this.whiteMatterLayer = new Layer(y - h, w, h, "White matter");
        // this.granuleLayer = new Layer(y - 2 * h, w, h, "Granule layer");
        // this.purkinjeLayer = new Layer(y - 3 * h, w, h, "Purkinje layer");
        // this.molecularLayer = new Layer(y - 4 * h, w, h, "Molecular layer");
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
