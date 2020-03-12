/**
 * @author afmika
 * afmichael73@gmail.com
 */
 
class Graph {
    /**
     * @returns {number}
     */
    static Infinity() {
        return 1000000;
    }

	/**
	 * Removes duplicated sequences
	 * Removes identities such as A B A , or A B C B C A
	 * @param {string[]} trajectory
	 * @returns {string[]}
	 */
	static cleanTrajectory(trajectory) {
		// eg. A, B, E, B, E, F -> A B E F
		let clean_version = [];
		let cycle = null;
		for(let i = 0; i < trajectory.length; i++) {
			let current = trajectory[i];
			for(let k = i + 1; k < trajectory.length; k++) {
				let next = trajectory[k];
				if(current == next) {
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
			return Graph.cleanTrajectory(clean_version);
		}
	}
	
	
    /**
     * @constructor
     * @param {JSON} config
     */
    constructor(config) {
        this.coord = {};
        if(config)
            this.setConfig(config);
    }

    /**
     * Configures the current graph
     * @param {JSON} config 
     */
    setConfig(config) {
        this.nodes = config.nodes || null;
        this.distances = config.distances || null;

        this.check();
        this.initNodeMap();
    }

    check() {
        // checks if empty
        if(this.nodes == null || this.distances == null)
            throw new Error("Please specify a correct configuration {nodes , dist} ");

        // checks if nodes[] contains repeated values
        let sorted=  this.nodes.sort((a, b) => a.localeCompare(b));
        let latest = null;
        sorted.forEach(value => {
            if(latest == null) {
                latest = value;
            } else {
                if(latest == value)
                    throw new Error("Nodes array must have distinct values");
                else
                    latest = value;                    
            }
        });

        // check if the number of nodes is the same
        let count = 0;
        let row_count = 0;
        this.distances.forEach((row, i) => {

            // checks if each row has the same number of element
            let tmp = row.length;
            if(i == 0) {
                row_count = row.length;
            }

            if(tmp != row_count) {
                throw new Error(`Row length doesn't match. The matrix input is not ${row_count} x ${row_count}`);
            }

            row.forEach(value => {
                if(typeof value != 'number') {
                    throw new Error("Matrix value must be a number!");
                }
                count++;
            });
        });

        if(count != Math.pow(this.nodes.length, 2) ) {
            throw new Error(`The matrix input is not ${this.nodes.length} x ${this.nodes.length}`);
        }
    }

    initNodeMap() {
        this.map = {};
        this.nodes.forEach((node, index) => {
            this.map[node] = index;
        });
    }

    /**
	 * Gives the distance between node_a and node_b according to this.map[][]
     * @param {string} node_a 
     * @param {string} node_b 
     */
    dist(node_a, node_b) {
        if(typeof node_a != 'string' || typeof node_b != 'string') {
            throw new Error("Inputs specified must be string!");
        }
        
        return this.distances[ this.map[node_a] ] [ this.map[node_b] ];
    }

    /**
	 * Defines the absolute coordinate of a given node.
	 * Mainly used to draw the current graph since this.map[][]
	 * represents the actual graph's topology
     * @param {string} node_name 
     * @param {Object} point { x : number, y : number}
     */
    setCoord(node_name, point) {
        this.coord[''+ node_name ] = point;
    }

    /**
     * Computes the 'real' distance between two nodes according to their absolute coordinates
     * @param {string} node_a 
     * @param {string} node_b 
     * @returns {number} -1 if node_a or node_b is undefined
     */
    distAbsoluteCoord(node_a, node_b) {
        if(this.coord[node_a] && this.coord[node_b]) {
            let pa = this.coord[node_a];
            let pb = this.coord[node_b];
            return Math.sqrt(Math.pow(pa.x - pb.x, 2) + Math.pow(pa.y - pb.y, 2));
        }
        return -1;
    }
}