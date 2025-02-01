import { getYPositionAbs } from "./utils.js";

export default class Cell {
    constructor({ id, x, y, cellType, width, height, color, layer }) {
        this.id = id;
        this.cellType = cellType;
        this.x = x;
        this.y = getYPositionAbs(y, layer);
        this.width = width;
        this.height = height;
        this.color = color;
        this.layer = this.layer;
        this.axon = null;
        this.receptors = [];
        this.isActive = false;
        this.axon = null;
        this.dendrites = null;
    }

    getAxon() {
        return this.axon;
    }

    getDendrites() {
        return this.dentrites;
    }

    getColor() {
        if (this.isActive) {
            return [99, 255, 0];
        }
        return this.color;
    }

    intersects(x, y) {
        let dx = (x - this.x) / (this.width / 2);
        let dy = (y - this.y) / (this.height / 2);
        const somaIntersects = dx * dx + dy * dy <= 1;
        let axonIntersects = false;
        if (this.axon && this.axon.intersects) {
            axonIntersects = this.axon.intersects(x, y);
        }
        return somaIntersects || axonIntersects;
    }

    render(p5) {
        if (this.dendrites) {
            // this.receptors.forEach((receptor) => receptor.render(p5));
            this.dendrites.render(p5);
        }

        if (this.axon) {
            this.axon.render(p5);
        }

        p5.stroke(...this.getColor());
        p5.fill(...this.getColor());
        p5.ellipse(this.x, this.y, this.width, this.height);
    }
}
