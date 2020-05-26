'use strict';

class FieldOperate extends FieldBase {
	constructor(args) {
		super(args);
		this.makeBlocks();
	}

	isValidCoord(x, y) {
		return _.zipWith([this.params.width, this.params.height], [x, y], (max, x) => ((0 <= x) && (x < max)))
			.every(x => x == true);
	}

	powToShade(pow) {
		let percents = 100 / (this.params.winPower - this.params.startPower) * (pow - this.params.startPower);
		if (percents < 0) percents = 0;
		if (percents > 100) percents = 100;
		return percents;
	}

	textToColor(text) {
		let n = Number(text);
		let pow = Math.log2(n);
		let shade = this.powToShade(pow);
		return {
			bg: `hsl(0, 0%, ${shade}%)`,
			fg: shade < 60 ? 'white' : 'black',
		};
	}

	add(x, y, text, merge = false) {
		let block = createDivClass('block');
		block.innerText = text;

		let {bg, fg} = this.textToColor(text);
		block.style.background = bg;
		block.style.color = fg;

		if (merge) block.classList.add('merge');

		this.field.append(block);
		this.blocks[x][y] = block;

		this.move(block, x, y);

		return block;
	}

	delete(block, deleteFromBlocks = true) {
		block.remove();
		if (!deleteFromBlocks) return;

		let coord = this.getBlockCoord(block);
		this.blocks[coord[0]][coord[1]] = null;
	}

	get(x, y) {
		return this.blocks[x][y];
	}

	has(x, y) {
		return this.isValidCoord(x, y) && this.get(x, y) != null;
	}

	clear() {
		for (let column of this.blocks) {
			for (let block of column) {
				if (block) this.delete(block);
			}
		}
	}

	hasBlock(block) {
		return this.getBlockCoord(block) != null;
	}

	getBlockCoord(block) {
		for (let i = 0; i < this.params.width; i++) {
			for (let j = 0; j < this.params.height; j++) {
				if (this.blocks[i][j] == block) return [i, j];
			}
		}

		return null;
	}

	getBlockText(block) {
		return block.innerText;
	}

	getCoordText(x, y) {
		return this.getBlockText(this.get(x, y));
	}

	get freeCoords() {
		let ret = [];

		for (let i = 0; i < this.params.width; i++) {
			for (let j = 0; j < this.params.height; j++) {
				if (!this.has(i, j)) ret.push([i, j]);
			}
		}

		return ret;
	}

	getCoordPixels(x, y) {
		return [x, y].map(coord => coord * this.size + (coord + 1) * this.spacing);
	}

	move(block, x, y) {
		let old = this.getBlockCoord(block);
		this.blocks[old[0]][old[1]] = null;

		let startCoord = this.getCoordPixels(x, y);
		let endCoord = startCoord.map(x => x + this.size);
		endCoord = _.zipWith(this.getCoordPixels(this.params.width, this.params.height), endCoord, _.subtract);

		[block.style.left, block.style.top] = startCoord.map(x => x + 'px');
		[block.style.right, block.style.bottom] = endCoord.map(x => x + 'px');

		this.blocks[x][y] = block;
	}
}
