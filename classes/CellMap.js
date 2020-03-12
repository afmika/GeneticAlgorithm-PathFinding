/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

class CellMap {
    
    static Infinity() {
        return 1000000;
    }

	/**
	 * Removes duplicated sequences
	 * Removes identities such as A B A , or A B C B C A
	 * @param {Cell[]} trajectory
	 * @returns {Cell[]}
	 */
	static cleanTrajectory(trajectory) {
		// eg. A, B, E, B, E, F -> A B E F
		let clean_version = [];
		let cycle = null;
		for(let i = 0; i < trajectory.length; i++) {
			let current = trajectory[i];
			for(let k = i + 1; k < trajectory.length; k++) {
				let next = trajectory[k];
				if(current.equals(next)) {
					// Ex : a closed cycle such as A B C B C A can be reduced to a single node A
					// in our case i ... k can be reduced to the current node
					let temp_cycle = {
						start : i, 
						end : k, 
						length : (k - i),
						reduced : current,
						pass : false
					};
					if(cycle != null) {
						cycle = temp_cycle.length > cycle.length 
								? temp_cycle : cycle;
					} else {
						cycle = temp_cycle;
					}
					break;
				}
			}
		}
					
		for(let q = 0; q < trajectory.length; q++) {
			let is_inside = false;
			if(cycle != null) {
				is_inside = q >= cycle.start && q <= cycle.end;			
			}
			if(!is_inside) {
				clean_version.push(trajectory[q]);
			} else if(!cycle.pass) {
				clean_version.push(cycle.reduced);
				cycle.pass = true;
			}
		}
		
		if(cycle == null) {
			return clean_version;
		} else {
			return CellMap.cleanTrajectory(clean_version);
		}
    }
    
	/**
	 * @constructor
	 * @param {number[][]} map
	 */
    constructor(map) {
        this.setMap(map);
    }

    /**
     * @returns {Cell} random cell
     */
    randCell() {
        let cell = null;
        while(true) {
            let [x, y] = [
                Math.floor(this.map[0].length * Math.random()),
                Math.floor(this.map.length * Math.random()),
            ];
            cell = new Cell(x, y);
            if(this.isEmpty(cell)) {
                break;
            }
        }
        return cell;
    }

    /**
     * Defines the GridMap's topology
     * * 0 refers to an empty cell
     * * 1 refers to a blocked cell
     * @param {number[][]} map 
     */
    setMap(map) {
        this.map = map || [];
    }

    /**
     * @param {Cell} cell 
     */
    isBlocked(cell) {
        try {
            return this.map[cell.y][cell.x] == 1;
        } catch(e) {
            // alert(cell.str());
            return true;
        }
    }

    /**
     * @param {Cell} cell
     */    
    isEmpty(cell) {
        return !this.isBlocked(cell);
    }

    /**
     * @param {Cell} cell_a 
     * @param {Cell} cell_b 
     */
    dist(cell_a, cell_b) {
        if(this.isBlocked(cell_a) || this.isBlocked(cell_b)) {
            return CellMap.Infinity();
        }

        // same cell
        if(cell_a.x == cell_b.x && cell_a.y == cell_b.y) {
            return CellMap.Infinity();
        }


        // checks if there is an obstacle between the two nodes
        // ray casting
        // y = ax + b => b = y - ax
        let deltaY = (cell_b.y - cell_a.y);
        let deltaX = (cell_b.x - cell_a.x);
        if(deltaX != 0) {            
            let a = deltaY / deltaX,
                b = cell_a.y - a * cell_a.x;
            let cursor = new Cell(cell_a.x, cell_a.y);
            let dx = deltaX < 0 ? -1 : 1;
            while(!cursor.equals(cell_b)) {
                if(this.isBlocked(cursor)) {
                    return CellMap.Infinity();
                }
                cursor.x += dx;
                cursor.y = Math.floor(a*cursor.x + b);
                // alert(`A- start ${cell_a.str()} target ${cell_b.str()}  dx=${dx} current ${cursor.str()}`);
            }
        } else {
            // xB - xA = 0 <=> xA = xB => (D) : x = xA or xB
            let cursor = new Cell(cell_a.x, cell_a.y);
            let dy = deltaY < 0 ? -1 : 1;
            while(!cursor.equals(cell_b)) {
                if(this.isBlocked(cursor)) {
                    return CellMap.Infinity();
                }
                cursor.y += dy;
                // alert(`B- start ${cell_a.str()} target ${cell_b.str()}  dx=${dx} current ${cursor.str()}`);
            }
        }
        // alert("Other");
        return Math.sqrt(Math.pow((cell_a.x - cell_b.x), 2) + Math.pow((cell_a.y - cell_b.y), 2));
    }
}