/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

class Creature extends Cell {
    /**
     * @constructor
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        super(x, y);
        this.radar_radius = 5; // in px
    }

    /**
     * @param {Cell} target 
     * @returns {boolean} true if the current creature is near the target's position
     */
    isNear(target, dim) {
        let [a, b] = [target, this];
        let r2 = this.radar_radius * this.radar_radius;
        let factor = dim || 1;
        let r = Math.pow(a.x * factor - b.x * factor, 2) + Math.pow(a.y * factor - b.y * factor, 2);
        return r <= r2;
    }

    /**
     * @param {CellMap} graph 
     * @param {Cell} target
     * @returns {boolean} true if the current creature still can walk
     */
    walkTo(dv, graph, target, dim) {
        let factor = dim || 1;
        if(this.isNear(target, dim)) {
            return false;
        }

        let deltaY = (target.y * factor - this.y * factor);
        let deltaX = (target.x * factor - this.x * factor);
        let dx = deltaX < 0 ? -dv : dv;
        if(deltaX != 0) {            
            let a = deltaY / deltaX;
            this.x += dx;
            // y = y + dy 
            // => dy = a * dx : (y = ax + b)
            this.y += a * dx;
            // alert(`A- start ${this.str()} target ${target.str()}  dx=${dx} current ${this.str()}`);
        } else {
            // xB - xA = 0 <=> xA = xB => (D) : x = xA or xB
            let dy = deltaY < 0 ? -dv : dv;
            this.y += dy;
            // alert(`B- start ${this.str()} target ${target.str()}  dx=${dx} current ${this.str()}`);
        }
        return true;
    }
}