import config from "./config.js";
import { getYPositionAbs } from "./utils.js";

export default class CerebellarNuclei {
    constructor(whiteMatterLayer) {
        let { id, x, y, color, height, label } = config.cerebellarNuclei;
        let bounds = whiteMatterLayer.getBounds();
        let maxHeight = bounds.y2 - bounds.y1 - 10;
        this.id = id;
        this.x = x;
        this.y = y;
        this.color = color;
        this.label = label;
        this.height = Math.min(height, maxHeight);
        this.width = this.height * 1.8;
        this.layer = whiteMatterLayer;
    }

    render(p5) {
        let y = getYPositionAbs(this.y, this.layer);
        p5.stroke(...this.color);
        p5.fill(...this.color);
        p5.ellipse(this.x, y, this.width, this.height);
    }
}
