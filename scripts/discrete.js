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


let result = pathfinder.findPath(objective, function(fitest, generation) {
	if(generation % 100 == 0) {
		console.log("Dist "+(1 / fitest.score));
	}
});
let solution = CellMap.cleanTrajectory(result.dna);
// status
let text_x = 30;
Draw.text("Distance "+(1 / result.score), text_x, 30);
Draw.gridCell(cellmap, canvas.width, canvas.height, solution, objective);