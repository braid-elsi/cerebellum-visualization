import { getYPositionAbs } from "./utils.js";

export default class Cell {
    constructor({ id, x, y, cellType, width, height, color, layer }) {
        console.log(
            "Cell base constructor:",
            id,
            x,
            y,
            cellType,
            width,
            height,
            color,
            layer
        );
        this.id = id;
        this.cellType = cellType;
        this.x = x;
        this.y = getYPositionAbs(y, layer);
        this.width = width;
        this.height = height;
        this.color = color;
        this.layer = this.layer;
    }

    intersects(x, y) {
        let dx = (x - this.x) / (this.width / 2);
        let dy = (y - this.y) / (this.height / 2);
        return dx * dx + dy * dy <= 1;
    }

    render(p5) {
        p5.stroke(...this.color);
        p5.fill(...this.color);
        p5.ellipse(this.x, this.y, this.width, this.height);
    }
}
