import { isPointNearLine } from "./utils.js";
import Receptor from "./receptor.js";

export default class Axon {
    constructor({ source, targetCells, axonWidth = 3 }) {
        this.source = source;
        this.targetCells = targetCells;
        this.axonWidth = axonWidth;
        this.receptorWeight = 3;
        this.polylines = [];
        this.receptors = [];
    }

    render(p5) {
        const color = this.source.getColor();
        p5.strokeWeight(this.axonWidth);
        p5.stroke(...color);

        // draw axon fibers:
        this.polylines.forEach((polyline) => {
            polyline.forEach((line) => {
                const { start, end } = line;
                p5.line(start.x, start.y, end.x, end.y);
            });
        });

        // draw receptors:
        p5.strokeWeight(this.receptorWeight);
        this.receptors.forEach((receptor) => {
            p5.ellipse(receptor.x, receptor.y, receptor.width, receptor.height);
        });
    }

    intersects(x, y) {
        for (const polyline of this.polylines) {
            for (const line of polyline) {
                if (isPointNearLine(x, y, line, this.axonWidth * 2)) {
                    return true;
                }
            }
        }
        return false;
    }
}
