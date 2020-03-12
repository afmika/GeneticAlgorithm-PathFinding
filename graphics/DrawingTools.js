/**
 * @author afmika
 * @email afmichael73@gmail.com
 * github.com/afmika
 */
 
function roundTo(n, r) {
	n = Math.round(n * Math.pow(10, r));
	return n * Math.pow(10, -r);
}

class DrawingTools {
	constructor(context) {
		if(context) {
			this.context = context;
		} else {
			throw "PLEASE DEFINE A 2D CONTEXT FIRST";
		}
	}
	
	clear(x, y, c_width, c_height) {
		this.context.clearRect(x, y, c_width, c_height);
	}

	setFill(color) {
		this.context.fillStyle = color;
	}
	setOutline(color) {
		this.context.strokeStyle = color;
	}
	setLineWidth(width) {
		this.context.lineWidth = width;
	}


	line(minX, minY, maxX, maxY, stroke, thickness) {
		let context = this.context;

		// x
		context.beginPath();
		context.lineWidth = thickness;
		context.strokeStyle = stroke || "black";
		
		context.moveTo(minX, minY);
		context.lineTo(maxX, maxY);

		context.stroke();
		context.closePath();		
	}

	text(value, x, y) {
		let context = this.context;
		context.beginPath();
		context.lineWidth = 0.6;
		context.strokeStyle = "black";
		context.strokeText(value, x, y);
		context.closePath();
	}

	axis(minX, maxX, minY, maxY, stroke) {

		// x
		this.line(minX, 0, maxX, 0, stroke);

		// y	
		this.line(0, minY, 0, maxY, stroke);	
	}

	/**
	 * Draw a circle shape
	 * @param {number} centerX 
	 * @param {number} centerY 
	 * @param {number} radius 
	 * @param {number} stroke 
	 * @param {number} fill 
	 */
	circle(centerX, centerY, radius, stroke, fill) {
		let context = this.context;
		context.beginPath();
		context.strokeStyle = stroke || "black";

		context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
		if( fill ) {
			context.fillStyle = fill;
			context.fill();
		}
		context.stroke();
		context.closePath();		
	}

	/**
	 * @param {Graph} graph 
	 * @param {number} offsetX
	 * @param {number} offsetY 
	 */
	graph(graph, trajectory) {
		let context = this.context;

		for(let node_a in graph.coord) {
			let point = graph.coord[ node_a ];
			for(let node_b in graph.coord) {
				let other = graph.coord[ node_b ];
				if(graph.dist(node_a, node_b) < Graph.Infinity()) {

					this.line(point.x, point.y, other.x, other.y, 'rgb(0,0,200, 0.3)', 2);
					
					let mid_x = (point.x + other.x) /2;
					let mid_y = (point.y + other.y) /2 - 10;

					this.text(graph.dist(node_a, node_b) + " Km", mid_x, mid_y);
				}
			}

			this.circle(point.x, point.y, 16, 'blue');
			this.text(node_a, point.x, point.y - 5);
		}

		if(trajectory) {
			trajectory = trajectory.filter(node => node != '');
			for (let k = 1; k < trajectory.length; k++) {
				let node_a = trajectory[k - 1];
				let node_b = trajectory[k];
				let [a, b] = [ graph.coord[ node_a ], graph.coord[ node_b ] ];
				this.line(a.x, a.y, b.x, b.y, `rgb(100, 0, 100, 0.4)`, 10);
			}
		}
	}

	/**
	 * @param {CellMap} cellmap 
	 * @param {Cell[]} trajectory
	 */
	gridCell(cellmap, width, height, trajectory, objective) {
		let context = this.context;
		let map = cellmap.map;
		let dim = height / map.length;
		context.beginPath();
		for (let y = 0; y < map.length; y++) {
			for (let x = 0; x < map[y].length; x++) {
				const value = map[y][x];
				context.strokeWidth = 2;
				let stroke =  `rgb(0, 0, 100, 0.6)`;
				let fill =  `rgb(0, 0, 100, 0.4)`;
				if(value == 0) {
					Draw.circle(x * dim + dim / 2, y * dim + dim / 2, dim / 4, stroke);
				} else {
					Draw.circle(x * dim + dim / 2, y * dim + dim / 2, dim / 4, stroke, fill);
				}
			}
		}
		context.closePath();


		let color =  `rgb(150, 200, 2, 0.5)`;
		if(objective) {
			context.beginPath();
			let i = 0;
			for(let cell in objective) {
				cell = objective[ cell ];
				const [x, y] = [cell.x, cell.y];
				Draw.circle(x * dim + dim / 2, y * dim + dim / 2,  dim / 4, color, color);
				this.text(` ${ i == 0 ? "START" : "END"}  `, x * dim, y * dim + 30);
				i++;
			}
			context.closePath();
		}

		if(trajectory) {
			context.beginPath();
			for (let k = 1; k < trajectory.length; k++) {
				let a = trajectory[k - 1];
				let b = trajectory[k];
				
				Draw.circle(a.x * dim + dim / 2, a.y * dim + dim / 2,  dim / 6, color, color);
				this.line(a.x * dim+ dim / 2, a.y* dim+ dim / 2, b.x* dim+ dim / 2, b.y* dim+ dim / 2, `rgb(200, 0, 100, 0.3)`, 4);
				this.text(` ${k}  `,b.x * dim + dim / 2, b.y * dim + 10);
			}
			context.closePath();
		}

	}
}