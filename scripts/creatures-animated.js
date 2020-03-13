/**
 * @author afmika
 * @email afmichael73@gmail.com
 * https://github.com/afmika
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const Draw = new DrawingTools(ctx);

const canvasMirror = document.getElementById("canvasMirror");
const ctxMirror = canvasMirror.getContext('2d');
const DrawMirror = new DrawingTools(ctxMirror);

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

pathfinder.n_population = 60;
pathfinder.generation_max = 1000;
pathfinder.mutation_rate = 0.5;
pathfinder.fitest_rate = 0.2;

let creatures_anim = [];


let generation = 0;
pathfinder.initPopulation(objective.from, objective.to);

let fitest = null;
let solution = null;
let solution_stack = [];
let interval = setInterval(function() {
	
	Draw.clear(0, 0, canvas.width, canvas.height);
	DrawMirror.clear(0, 0, canvasMirror.width, canvasMirror.height);
	
	if(generation < pathfinder.generation_max) {
		fitest = pathfinder.step(); // next generation
		solution = CellMap.cleanTrajectory(fitest.dna);
		generation++;
		
		if(generation % 20 == 0) {
			generateCreatureFrom(solution);
		}
		
		if( !solutionAlreadyFound(solution) ) {
			generateCreatureFrom(solution, "red", "rgb(200,0,100,0.6)");
			solution_stack.push(solution);
		}
		
		
		Draw.gridCell(cellmap, canvas.width, canvas.height, [], objective);
	} else {
		Draw.gridCell(cellmap, canvas.width, canvas.height, solution, objective);
	}
	
	DrawMirror.gridCell(cellmap, canvasMirror.width, canvasMirror.height, solution, objective);

	// status
	let text_x = 30;
	DrawMirror.text("MIRROR", text_x, 15);
	DrawMirror.text("Generation "+generation , text_x, 30);
	Draw.text("Generation "+generation , text_x, 30);
	DrawMirror.text("Distance "+(1 / fitest.score), text_x, 45);

	animateCreatures();
	if(animationDone() && creatures_anim.length != 0) {
		clearInterval(interval);
	}

}, 1000 / 24);


function generateCreatureFrom(solution, stroke_color, fill_color) {
	let anim_data = {};
	anim_data.index = 0;
	anim_data.fill_color = fill_color || "rgb(0,0,100,0.3)";
	anim_data.stroke_color = stroke_color || "blue";
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
	
		Draw.circle(anim_data.creature.x * dim + dim/2, anim_data.creature.y * dim + dim/2, dim/12, anim_data.stroke_color, anim_data.fill_color);
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


function solutionAlreadyFound(solution) {
	for(let i = 0; i < solution_stack.length; i++) {
		if(solution_stack[i].length == solution.length) {		
			let count = 0;
			for(let node = 0; node < solution.length; node++) {
				count += solution[node] == solution_stack[i][node] ? 1 : 0;
			}	
			if(count == solution.length) {
				return true;
			}
		}
	}
	return false;
}