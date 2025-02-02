import { isPointNearLine } from "../neurons/utils.js";
import Receptor from "../dendrites/receptor.js";

export default class Axon {
    constructor({ source, targetCells, axonWidth = 3 }) {
        this.source = source;
        this.targetCells = targetCells;
        this.axonWidth = axonWidth;
        this.receptorWeight = 3;
        this.polylines = [];
        this.terminals = [];
    }
    addTerminal(terminal) {
        this.terminals.push(terminal);
    }

    // render(p5) {
    //     for (const terminal of this.terminals) {
    //         terminal.render(p5);
    //     }
    // }

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

        // TODO: replace with Terminal objects (see Dendrites)
        // draw receptors:
        p5.strokeWeight(this.receptorWeight);
        this.terminals.forEach((receptor) => {
            p5.ellipse(receptor.x, receptor.y, receptor.width, receptor.height);
        });
        // End TODO
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
