import config from "./config.js";
import { drawLabel, getYPositionAbs } from "./utils.js";

export default class InferiorOlive {
    constructor(brainstemLayer) {
        let { id, x, y, color, height, label } = config.inferiorOlive;
        let bounds = brainstemLayer.getBounds();
        let maxHeight = bounds.y2 - bounds.y1 - 10;
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.label = label;
        this.height = Math.min(height, maxHeight);
        this.width = this.height * 1.6;
        this.layer = brainstemLayer;
    }

    render(p5) {
        let y = getYPositionAbs(this.y, this.layer);
        p5.stroke(...this.color);
        p5.fill(...this.color);
        p5.ellipse(this.x, y, this.width, this.height);
        drawLabel(p5, this.label, this.layer);
    }
}
