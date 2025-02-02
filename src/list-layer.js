import Layer from "./layer.js";
import config from "./config.js";

export default class LayerList {
    molecularLayer = null;
    purkinjeLayer = null;
    granuleLayer = null;
    whiteMatterLayer = null;
    brainstemLayer = null;

    constructor({ screenW, screenH, fontFamily }) {
        console.log(screenW, screenH, fontFamily);
        let y = screenH;
        let w = screenW;
        for (const key in config.layers) {
            const { heightFraction, label, color } = config.layers[key];
            const h = heightFraction * screenH;
            this[key] = new Layer({
                y,
                width: w,
                height: h,
                label,
                fontFamily,
                color,
            });
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

    render(p5) {
        this.getLayers().forEach((layer) => layer.render(p5));
    }

    renderLabels(p5) {
        this.getLayers().forEach((layer) => layer.renderLabel(p5));
    }
}
