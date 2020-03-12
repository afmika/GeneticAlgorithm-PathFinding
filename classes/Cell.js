/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

class Cell {
    /**
     * @constructor
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    /**
     * @param {Cell} cell
     * @returns {Boolean} true if equals to the current object
     */
    equals(cell) {
        return this.x == cell.x && this.y == cell.y;
    }

    /**
     * @returns {Cell} cloned cell
     */
    clone() {
        return new Cell(this.x, this.y);
    }

    /**
     * @returns {string} string representation of the current cell
     */
    str() {
        return `${this.x}, ${this.y}`;
    }
}