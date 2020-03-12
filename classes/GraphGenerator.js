/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

class GraphGenerator {
    /**
     * @constructor
	 * @param {string[]} nodes
     */
    constructor(nodes) {
        this.nodes = nodes || [];
        this.unconnected = {};
    }

    /**
     * @param {string} node_a 
     * @param {string} node_b 
     */
    unconnect(node_a, node_b) {
        this.unconnect[node_a] = node_b;
        this.unconnect[node_b] = node_a;
    }

    /**
     * @param {number} min_x 
     * @param {number} max_x 
     */
    setHorizontalBounds(min_x, max_x) {
        this.min_x = min_x || 0;
        this.max_x = max_x || 200;
    }

    /**
     * @param {number} min_y 
     * @param {number} max_y 
     */
    setVerticalBounds(min_y, max_y) {
        this.min_y = min_y || 0;
        this.max_y = max_y || 200;
    }

    /**
	 * Generates a graph with a random topology
	 * Each nodes of the generated graph will not exceed the predefined 
	 * bounds of the current GraphGenerator.
     * @returns {Graph} generated graph
     */
    generateGraph() {
        let nodes = this.nodes;
        let distances = [];
        let graph = new Graph();
        let min_dist_between_nodes = 50;

        // first we define their coordinates
        let index = 0;
        while(index < nodes.length) {
            let x_rand = this.min_x + (this.max_x - this.min_x) * Math.random();
            let y_rand = this.min_y + (this.max_y - this.min_y) * Math.random();
            let p = {x : x_rand, y : y_rand};
            graph.setCoord(nodes[index], p);

            // Checks some values
            let try_another = false;
            nodes.forEach(node => {
                let dist = graph.distAbsoluteCoord(node, nodes[index]);
                if(dist >= 0 && dist <= min_dist_between_nodes) {
                    // try_another = true;
                    // alert("OH NOHHH");
                    return;
                }
            });
            if(! try_another ) {
                index++;
            }
        }
		// now we can guess each distance between two nodes from their absolute coordinates (px)
        for (let i = 0; i < nodes.length; i++) {
            distances[i] = [];
            for (let j = 0; j < nodes.length; j++) {
                let dist = Math.round( graph.distAbsoluteCoord(nodes[i], nodes[j]) );
                let unlink = this.unconnect[nodes[i]] == nodes[j]; 
                dist = unlink ? Graph.Infinity() : dist; 
                distances[i][j] = i != j ? dist : Graph.Infinity();
            }                
        }

        graph.setConfig({
            nodes : nodes,
            distances : distances
        });

        return graph;
    }
}