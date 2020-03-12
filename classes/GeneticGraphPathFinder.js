/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

 

/**
 * @constructor
 * @param {string[]} dna
 */
function Member(dna) {
	this.dna = dna;
	this.score = 0;
}

/**
 * Generates a random Member
 * @param {string[]} nodes 
 * @param {string} start 
 * @param {string} dest 
 * @param {number} n_nodes_max 
 */
function randomMember(nodes, start, dest, n_nodes_max) {
	let dna = [];
	dna.push(start);
	for(let i = 1; i < (n_nodes_max - 1); i++) {
		let index_random = Math.floor( nodes.length * Math.random() );
		dna[i] = nodes[index_random];
	}
	dna.push(dest);
	return new Member(dna);
}

class GeneticGraphPathFinder {
    /**
     * @constructor
     * @param {Graph} graph 
     */
    constructor(graph) {
        this.setGraph(graph);
        this.generation_max = 1000;

        this.mutation_rate = 0.2;
        this.fitest_rate = 0.3;
        this.n_population = 100;
        this.n_nodes_max = graph.nodes.length; // length of the sequence
    }

    /**
     * @param {Graph} graph
     */
    setGraph(graph) {
        this.graph = graph;
    }
    
    /**
     * @param {string} start start node
     * @param {string} dest  target node
     */
    initPopulation(start, dest) {
        this.current_objective = {
            from : start, to : dest
        };

        this.population = [];
        for(let i = 0; i < this.n_population; i++) {
            this.population.push( randomMember(this.graph.nodes, start, dest, this.n_nodes_max) );
        }
    }

    /**
     * One step == One generation
     * @returns {Member} Current fitest
     */
    step() {
        this.evaluatePopulation( this.population );
        this.sortInverse( this.population );
        
        let fitest = this.population[0];

        let new_generation = [];
        let parents = [];  // parents => 'fitest'
        let pourcentage_parents = this.fitest_rate * this.population.length;
        
        this.population.forEach( (member, index) => {
            if(index <= pourcentage_parents) {
                parents.push( member ); // parents
                new_generation.push( member ); 
            }
        });
        
        while(new_generation.length < this.population.length) {
            let father_index = Math.floor(Math.random() * parents.length);
            let mother_index = Math.floor(Math.random() * parents.length);
            if(mother_index != father_index) {
                const father = parents[ father_index ];
                const mother = parents[ mother_index ];
                let child = this.crossOver(father, mother);
                
                this.mutate( child );
                new_generation.push( child );
            }
        }
        this.population = new_generation;

        return fitest;
    }

    /**
     * Finds the shortest path between two nodes
     * @param {JSON} config {from : node_name, to : node_name}
     * @param {Function} fun Callback function called at each generation
     */
    findPath(config, fun) {
        let generation = 0;
        this.initPopulation(config.from, config.to);
        let fitest = null;
        while(generation < this.generation_max) {
            fitest = this.step();
            fun(fitest, generation);
            generation++;
        }
        return fitest;
    }

    /**
	 * Sorts the given population according to the fitness of each individual
     * @param {Member[]} population 
     */
    sortInverse(population) {
		for(let i = 1; i < population.length; i++) {
			if(population[i - 1].score < population[i].score) {
				let temp = population[i - 1];
				population[i - 1] = population[i];
                population[i] = temp;
				this.sortInverse(population);
			}
		}
	}

    /**
	 * Evaluates a single individual (Member)
     * @param {Member} member Entity to evaluate
     */
	evaluate(member) {
		let cleaned = Graph.cleanTrajectory(member.dna);
		let total_dist = 0;
		for(let i = 1; i < cleaned.length; i++) {
			let node_A = cleaned[i-1];
            let node_B = cleaned[i];
            
			total_dist += this.graph.dist(node_A, node_B);
        }

		member.score = total_dist == 0 ? 0 : 1 / total_dist;
	}
    
    /**
     * Evaluates an entire population
     * @param {Member[]} population 
     */
	evaluatePopulation(population) {
		population.forEach(x => {
            this.evaluate(x);
		});
	}
    
    /**
	 * Mutates an individual (member) based on this.mutation_rate
     * @param {Member} member member to mutate
     */
	mutate(member) {
		for(let i = 1; i < (this.n_nodes_max - 1); i++) {
			if(Math.random() <= this.mutation_rate) {
				let index_random = Math.floor( this.graph.nodes.length * Math.random() );
				member.dna[i] = this.graph.nodes[index_random];
			}
		}
	}
    
    /**
	 * Cross over the dna of the two individuals
     * @param {Member} father 
     * @param {Member} mother 
     */
	crossOver(father, mother) {
		let child = new Member([]);
		let middle = Math.floor( this.n_nodes_max / 2 );
		for(let i = 0; i < this.n_nodes_max; i++) {
			const gene = i < middle ? father.dna[i] : mother.dna[i];
			child.dna.push( gene );
		}
		return child;
	}
}