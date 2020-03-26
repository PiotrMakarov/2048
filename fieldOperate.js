function powToShade(pow) {
	let percents = 100 / 11 * pow;
	if (percents > 100) percents = 100;
	return percents;
}

function textToColor(text) {
	let n = Number(text);
	let pow = Math.log2(n);
	return {
		bg: `hsl(0, 0%, ${powToShade(pow)}%)`,
		fg: n < 128 ? 'white' : 'black',
	};
}

class FieldOperate extends FieldBase {
	constructor(...args) {
		super(...args);
		this.blocks = [];
		for (let i = 0; i < this.width; i++) {
			this.blocks.push([]);
			for (let j = 0; j < this.height; j++) {
				this.blocks[i].push(null);
			}
		}
	}

	isValidCoord(x, y) {
		return _.zipWith([this.width, this.height], [x, y], (max, x) => ((0 <= x) && (x < max)))
			.every(x => x == true);
	}

	add(x, y, text, merge = false) {
		let block = createDivClass('block');
		block.innerText = text;

		let {bg, fg} = textToColor(text);
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

	hasBlock(block) {
		return this.getBlockCoord(block) != null;
	}

	getBlockCoord(block) {
		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
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

		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				if (!this.has(i, j)) ret.push([i, j]);
			}
		}

		return ret;
	}

	move(block, x, y) {
		let old = this.getBlockCoord(block);
		block.style['grid-area'] = [y, x].map(x => x + 1).join(' / ');
		this.blocks[old[0]][old[1]] = null;
		this.blocks[x][y] = block;
	}

}
