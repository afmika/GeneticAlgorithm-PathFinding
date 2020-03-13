/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const Draw = new DrawingTools(ctx);

const inf = Graph.Infinity();
let graph = new Graph();
graph.setConfig({
	nodes : ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
	distances : [
		//'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'
		[inf, 246, 767, 440, 433, 174, inf, inf, 307,  843],  // A
		[246, inf, 564, inf, 348, 221, 236, 70, 442, 670  ],  // B
		[767, 564, inf, 466, 416, inf, 668, 503, 760, 164 ],  // C
		[440, inf, 466, inf, 64, 265, 302, 328, 305, 470  ],  // D
		[433, 348, 416, 64, inf, 261, inf, 282, 345, 437  ],  // E
		[174, 221, inf, 265, 261, inf, 42, 204, 221, 684  ],  // F
		[inf, 236, 668, 302, inf, 42, inf, 230, 212, 726  ],  // G
		[inf, 70, 503, 328, 282, 204, 230, inf, 421, 603  ],  // H
		[307, 442, 760, 305, 345, 221, 212, 421, inf, inf ],  // I
		[843, 670, 164, 470, 437, 684, 726, 603, inf, inf ] // J
	]
});


// display
graph.setCoord('A', { x: 80.01643977721416, y: 404.0443863439588 });
graph.setCoord('B', { x: 312.02114200279067, y: 484.81007964052156 });
graph.setCoord('C', { x: 836.469409676824, y: 278.5395555509364 });
graph.setCoord('D', { x: 403.4056685400733, y: 106.3415061315999 });
graph.setCoord('E', { x: 437.8627482414707, y: 160.4890572674536 });
graph.setCoord('F', { x: 210.2723598260282, y: 288.37316532197076 });
graph.setCoord('G', { x: 169.13396242739483, y: 297.4037951120623 });
graph.setCoord('H', { x: 356.62997742141937, y: 430.65262309739876 });
graph.setCoord('I', { x: 98.22188779529698, y: 97.94696136651525 });
graph.setCoord('J', { x: 873.1676822354477, y: 118.86457737224731 });

let generation = 0;
let algo = new GeneticGraphPathFinder(graph);

// making stuff a little bit harder ...
// we can increase 'n_population'
// and decrease 'mutation_rate' if we want it to run faster
algo.n_population = 5; // fewer nb. of population
algo.mutation_rate = 0.8; // higher mutation rate
algo.generation_max = 100;

let target = {from : 'A', to : 'H'};
algo.initPopulation(target.from, target.to);

let interval = setInterval(function() {
	if(generation >= algo.generation_max) {
		alert("END");
		clearInterval(interval);
	}
	let fitest = algo.step(); // next generation
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