/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const Draw = new DrawingTools(ctx);
let cellmap = new CellMap([
	[0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
	[0, 1, 0, 0, 1, 0, 0, 1, 1, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
	[0, 1, 0, 0, 1, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 1, 0, 0],
	[0, 1, 0, 0, 0, 0, 1, 1, 0, 0],
	[0, 1, 0, 0, 1, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 1, 0, 0]
]);


let pathfinder = new GeneticDiscretePathFinder(cellmap);
let objective = {
	from : new Cell(0, 3),
	to : new Cell(9, 6)
};

pathfinder.n_population = 100;
pathfinder.generation_max = 1200;
pathfinder.mutation_rate = 0.3;
pathfinder.fitest_rate = 0.4;


let generation = 0;
pathfinder.initPopulation(objective.from, objective.to);
let interval = setInterval(function() {
	if(generation >= pathfinder.generation_max) {
		clearInterval(interval);
	}

	let fitest = pathfinder.step(); // next generation
	let solution = CellMap.cleanTrajectory(fitest.dna);
	
	Draw.clear(0, 0, canvas.width, canvas.height);
	Draw.gridCell(cellmap, canvas.width, canvas.height, solution, objective);

	// status
	let text_x = 30;
	Draw.text("Generation "+generation , text_x, 15);
	Draw.text("Distance "+(1 / fitest.score), text_x, 30);
	generation++;
}, 1000 / 60);