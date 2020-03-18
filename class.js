'use strict';

function createDivClass(...classNames){
	let elem = document.createElement('div');
	elem.classList.add(...classNames);
	return elem;
}

function flipMap(map) {
	let flipped = new Map();

	for (let pair of map) {
		let [key, value] = pair;
		flipped.set(value, key);
	}

	return flipped;
}

function resizeContainer(container) {
	let field = container.firstElementChild;

	['width', 'height'].forEach((property) => container.style[property] =
		field['offset' + _.capitalize(property)] + 'px');

	container.style.width = field.offsetWidth + 'px';
	container.style.height = field.offsetHeight + 'px';
}


class Field {
	constructor(width, height) {
		this.width = width;
		this.height = height;

		this.blocks = new Map();

		console.log(this.field);
	}


	makeBGField() {
		let field = createDivClass('field', 'bg');

		let s = document.documentElement.style;
		s.setProperty('--width', this.width);
		s.setProperty('--height', this.height);


		for (let i = 0; i < this.width * this.height; i++) {
			let block = createDivClass('block');
			field.append(block);
		}

		return field;
	}

	makeField() {
		let field = createDivClass('field');

		return field;
	}

	addBlock(x, y, text) {
		let block = createDivClass('block');
		block.innerText = text;

		this.field.append(block);
		this.blocks.set([x, y], block);

		this.moveBlock(block, x, y);

		return block;
	}

	getBlock(x, y) {
		for (let pair of this.blocks) {
			let [coord, block] = pair;
			if (_.isEqual([x, y], coord)) return block;
		}
	}

	getBlockCoord(block) {
		let flipped = flipMap(this.blocks);
		if (flipped.has(block)) return flipped.get(block);
	}

	moveBlock(block, x, y) {
		block.style['grid-area'] = [y, x].map(x => x + 1).join(' / ');
	}

	addRandomBlock() {
		let coord = [];

		[this.width, this.height].forEach(function (value) {
			coord.push(_.random(0, value-1));
		});

		this.addBlock(...coord, '2');
	}

	makeContainer(width, height) {
		let container = createDivClass('container');

		let bgField = this.makeBGField(this.width, this.height);
		let field = this.makeField(this.width, this.height);
		this.field = field;

		this.addRandomBlock();
		this.addRandomBlock();

		container.append(bgField);
		container.append(field);

		return container;
	}

	render() {
		let container = this.makeContainer();
		return container;
	}
}

let field = new Field(4, 4);
let elem = field.render();

setTimeout(() => field.addRandomBlock(), 1000);

document.body.append(elem);
resizeContainer(elem);
