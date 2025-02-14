import { getYPositionAbs } from "./utils.js";

/**
 * Represents a cell in a neural simulation.
 */
export default class Cell {
    /**
     * Creates a new Cell instance.
     * @param {Object} options - The options for initializing the cell.
     * @param {string} options.id - The unique identifier of the cell.
     * @param {number} options.x - The x-coordinate of the cell.
     * @param {number} options.y - The y-coordinate of the cell.
     * @param {string} options.cellType - The type of the cell.
     * @param {number} options.width - The width of the cell.
     * @param {number} options.height - The height of the cell.
     * @param {Array<number>} options.color - The RGB color of the cell.
     * @param {number} options.layer - The layer in which the cell resides.
     */
    constructor({ id, x, y, cellType, width, height, color, layer }) {
        this.id = id;
        this.cellType = cellType;
        this.x = x;
        this.y = getYPositionAbs(y, layer);
        this.width = width;
        this.height = height;
        this.color = color;
        this.layer = layer; // Fixed incorrect assignment
        this.axon = null;
        this.receptors = [];
        this.isActive = false;
        this.dendrites = null;
    }

    /**
     * Gets the axon of the cell.
     * @returns {Object|null} The axon object or null if not set.
     */
    getAxon() {
        return this.axon;
    }

    /**
     * Gets the dendrites of the cell.
     * @returns {Object|null} The dendrites object or null if not set.
     */
    getDendrites() {
        return this.dendrites; // Fixed typo (was `dentrites`)
    }

    /**
     * Gets the color of the cell.
     * @returns {Array<number>} The RGB color as an array of three numbers.
     */
    getColor() {
        if (this.isActive) {
            return [99, 255, 0];
        }
        return this.color;
    }

    /**
     * Checks if a given point (x, y) intersects with the cell.
     * @param {number} x - The x-coordinate of the point.
     * @param {number} y - The y-coordinate of the point.
     * @returns {boolean} True if the point intersects with the cell, false otherwise.
     */
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

    /**
     * Renders the cell using p5.js.
     * @param {Object} p5 - The p5.js instance.
     */
    render(p5) {
        if (this.dendrites) {
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
