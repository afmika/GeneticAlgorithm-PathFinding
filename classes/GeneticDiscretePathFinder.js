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
 * @param {CellMap} cellmap 
 * @param {string} start 
 * @param {string} dest 
 * @param {number} n_nodes_max 
 */
function randomMember(cellmap, start, dest, n_nodes_max) {
	let dna = [];
	dna.push(start);
	for(let i = 1; i < (n_nodes_max - 1); i++) {
		dna[i] = cellmap.randCell();
	}
	dna.push(dest);
	return new Member(dna);
}

class GeneticDiscretePathFinder {
    /**
     * @constructor
     * @param {CellMap} cellmap 
     */
    constructor(cellmap) {
        this.setCellMap(cellmap);
        this.generation_max = 1000;

        this.mutation_rate = 0.2;
        this.fitest_rate = 0.3;
        this.n_population = 100;
        this.n_nodes_max = Math.pow(cellmap.map.length, 2); // length of the sequence
    }

    /**
     * @param {CellMap} cellmap
     */
    setCellMap(cellmap) {
        this.cellmap = cellmap;
    }
    
    /**
     * @param {string} start start node
     * @param {string} dest  target node
     */
    initPopulation(start, dest) {
        this.current_objective = {
            from : start, to : dest
        };

        if(this.cellmap.isBlocked(start)) {
            throw "Invalid 'start', cell is blocked";
        }

        if(this.cellmap.isBlocked(dest)) {
            throw "Invalid 'dest', cell is blocked";
        }

        this.population = [];
        for(let i = 0; i < this.n_population; i++) {
            this.population.push( randomMember(this.cellmap, start, dest, this.n_nodes_max) );
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
        let clean = CellMap.cleanTrajectory(member.dna);
		let total_dist = 0;
		for(let i = 1; i < clean.length; i++) {
			let node_A = clean[i-1];
            let node_B = clean[i];
            
            total_dist += this.cellmap.dist(node_A, node_B);
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
				member.dna[i] = this.cellmap.randCell();
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