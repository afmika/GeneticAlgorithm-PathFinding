/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const Draw = new DrawingTools(ctx);

let generator = new GraphGenerator( ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'] );

generator.setHorizontalBounds(10, canvas.width - 10);
generator.setVerticalBounds(90, canvas.height - 10);

// There is no fun in connecting each node
// Let's make things a little more difficult by removing some connections
generator.unconnect('A', 'H');
generator.unconnect('E', 'G');
generator.unconnect('F', 'C');
generator.unconnect('B', 'D');
generator.unconnect('I', 'J');
// ------

let graph = generator.generateGraph();
let algo = new GeneticGraphPathFinder(graph);

// making stuff a little bit harder ...
// we can increase 'n_population'
// and decrease 'mutation_rate' if we want it to run faster
algo.n_population = 5; // fewer nb. of population
algo.mutation_rate = 0.8; // higher mutation rate
algo.generation_max = 100;

let target = {from : 'A', to : 'H'};
algo.initPopulation(target.from, target.to);
let generation = 0;

let interval = setInterval(function() {
	if(generation >= algo.generation_max) {
		alert("END");
		clearInterval(interval);
	}
	
	// next generation
	let fitest = algo.step(); 
	let solution = Graph.cleanTrajectory(fitest.dna);
	Draw.clear(0, 0, canvas.width, canvas.height);
	Draw.graph(graph,  solution );	
	
	// status
	let text_x = 30;
	Draw.text("Generation "+generation , text_x, 15);
	Draw.text("Distance "+(1 / fitest.score)+" Km" , text_x, 30);
	Draw.text("Start from "+target.from+" to "+target.to , text_x, 45);
	Draw.text("Nodes max "+algo.n_nodes_max , text_x, 60);
	Draw.text("DNA "+ fitest.dna.join(","), text_x, 80);
	Draw.text("Guessed Trajectory "+ solution.join(","), text_x, 100);
	generation++;
}, 1000 / 3);
