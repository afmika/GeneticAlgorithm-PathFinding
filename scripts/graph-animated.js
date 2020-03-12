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
    nodes : ['A', 'B', 'C', 'D', 'E', 'F'],
    distances : [
        // A, B, C, D, E, F
        [inf, 2, inf, inf, inf, 2], // A
        [2, inf, 12, inf, inf, 13], // B
        [inf, 12, inf, 2, 3, 4], // C
        [inf, inf, 2, inf, 3, inf], // D
        [inf, inf, 3, 3, inf, 11], // E
        [2, 13, 4, inf, 11, inf], // F
    ]
});

// display
let pivot = 200;
let offsetX = 25;
let ssy = 100;
graph.setCoord('A', {x : offsetX, y : canvas.height / 2});
graph.setCoord('B', {x : offsetX + pivot, y : -ssy + canvas.height / 2});
graph.setCoord('F', {x : offsetX + pivot, y :  ssy + canvas.height / 2});
graph.setCoord('C', {x : offsetX + 2 * pivot, y : -ssy + canvas.height / 2});
graph.setCoord('E', {x : offsetX + 2 * pivot, y :  ssy + canvas.height / 2});
graph.setCoord('D', {x : offsetX + 3 * pivot, y : canvas.height / 2});

let generation = 0;
let algo = new GeneticGraphPathFinder(graph);
algo.n_population = 50;
algo.generation_max = 200;

let target = {from : 'A', to : 'E'};
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
}, 1000 / 5);