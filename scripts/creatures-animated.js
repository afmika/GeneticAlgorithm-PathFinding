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
	[0, 1, 0, 0, 0, 0, 1, 0, 1, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
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
pathfinder.generation_max = 500;
pathfinder.mutation_rate = 0.3;
pathfinder.fitest_rate = 0.4;

let creatures_anim = [];


let generation = 0;
pathfinder.initPopulation(objective.from, objective.to);

let fitest = null;
let solution = null;
let interval = setInterval(function() {
	Draw.clear(0, 0, canvas.width, canvas.height);
	if(generation < pathfinder.generation_max) {
		fitest = pathfinder.step(); // next generation
		solution = CellMap.cleanTrajectory(fitest.dna);
		generation++;

		if(generation % 10 == 0) {
			generateCreatureFrom(solution);
		}
		Draw.gridCell(cellmap, canvas.width, canvas.height, [], objective);
	} else {
		Draw.gridCell(cellmap, canvas.width, canvas.height, solution, objective);
	}


	// status
	let text_x = 30;
	Draw.text("Generation "+generation , text_x, 15);
	Draw.text("Distance "+(1 / fitest.score), text_x, 30);


	animateCreatures();
	if(animationDone() && creatures_anim.length != 0) {
		clearInterval(interval);
	}

}, 1000 / 40);


function generateCreatureFrom(solution) {
	let anim_data = {};
	anim_data.index = 0;
	anim_data.solution = solution;
	anim_data.creature = new Creature(solution[anim_data.index].x, solution[anim_data.index].y);
	creatures_anim.push( anim_data );
}

function animateCreatures() {
	creatures_anim.forEach(anim_data => {
		let dim = canvas.width / pathfinder.cellmap.map.length;
	
		if(anim_data.solution[anim_data.index]) {
			let walked = anim_data.creature.walkTo(0.01, pathfinder.cellmap, anim_data.solution[anim_data.index], dim);
			if(!walked)
			anim_data.index++;
		} else {
			anim_data.done = true;
		}
	
		Draw.circle(anim_data.creature.x * dim + dim/2, anim_data.creature.y * dim + dim/2, dim/12, "blue", "rgb(0,0,100,0.3)");
	});
}

function animationDone() {
	let count = 0;
	creatures_anim.forEach(anim_data => {
		if(anim_data.done) 
			count++;
	});
	return count == creatures_anim.length;
}