import Layer from "./layer.js";
import config from "./config.js";

export default class LayerList {
    constructor(screenW, screenH) {
        let y = screenH;
        let w = screenW;
        for (const key in config.layers) {
            const { heightFraction, label, color } = config.layers[key];
            const h = heightFraction * screenH;
            this[key] = new Layer(y, w, h, label, color);
            y -= h;
        }
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
