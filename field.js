'use strict';

class Field extends FieldOperate {
	constructor(...args) {
		super(...args);

		this.new = [];
		this.lost = false;
	}

	merge(a, b) {
		if (a.innerText != b.innerText) return null;

		let coord = this.getBlockCoord(b);
		let sum = _.sum([a, b].map(x => Number(x.innerText)));

		this.move(a, ...coord);

		setTimeout(() => this.delete(a, false), this.timeoutMove);
		let c = this.add(coord[0], coord[1], sum, true);

		setTimeout(() => this.delete(b, false), this.timeout);

		if (Math.log2(sum) == this.winPower) {
			this.win()
		}

		return c;
	}

	getObstacleCoord(block, dx, dy) {
		let lastCoord = this.getBlockCoord(block);
		while (true) {
			let newCoord = _.zipWith(lastCoord, [dx, dy], _.add);

			if (
				!this.isValidCoord(...newCoord) ||
				this.has(...newCoord)
			) return newCoord;

			lastCoord = newCoord;
		}
	}

	moveUntilMerge(block, dx, dy) {
		let coord = this.getObstacleCoord(block, dx, dy);
		let preCoord = _.zipWith(coord, [dx, dy], _.subtract);

		let merged = false;
		let moved = !_.isEqual(this.getBlockCoord(block), preCoord);

		if (this.has(...coord)) {
			let mergeBlock = this.get(...coord);
			if (!this.new.includes(mergeBlock))
				merged = this.merge(block, mergeBlock);
		}
		if (!merged) this.move(block, ...preCoord);

		return merged || moved;
	}

	addRandomBlock() {
		let free = this.freeCoords;
		if (free.length == 0) return false;

		let coord = free[_.random(0, free.length-1)];
		let power = this.startPower;
		if (_.random(1, 10) == 1) power++;
		let digit = 2 ** power;

		this.add(...coord, digit);

		return true;
	}

	sendMessage(text, timeout) {
		this.message.innerText = text;
		this.message.classList.remove('hidden');
		if (timeout) setTimeout(() => this.hideMessage(), timeout);
	}

	hideMessage() {
		this.message.classList.add('hidden');
	}

	isMergeable(x, y) {
		let text;
		if (this.has(x, y)) text = this.getCoordText(x, y);
		else return false;

		let ret = false;
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (!( [dx, dy].includes(0) && !_.isEqual([dx, dy], [0, 0]) )) continue;

				let [nx, ny] = [x + dx, y + dy];
				if (!this.has(nx, ny)) continue;
				ret = ret || text == this.getCoordText(nx, ny);
			}
		}

		return ret;
	}

	check() {
		let ret = false;

		for (let i = 0; i < this.width; i++) {
			for (let j = 0; j < this.height; j++) {
				if (this.blocks[i][j] == null) continue;
				ret = ret || this.isMergeable(i, j);
			}
		}

		return ret || this.freeCoords.length != 0;
	}

	lose() {
		this.sendMessage('Game over');
	}

	win() {
		this.sendMessage('You win!');
	}

	getGoSideCoords(direction) {
		let ret = [];

		let delta = directionToDelta[direction];

		let iIndex = delta.indexOf(0);
		let maxIndex = Number(!Boolean(iIndex));

		let max = [this.width, this.height][iIndex];
		let retMax = delta[maxIndex] == 1
			? [this.width, this.height][maxIndex]-1
			: 0;

		for (let i = 0; i < max; i++) {
			let newCoord = new Array(2);

			newCoord[iIndex] = i;
			newCoord[maxIndex] = retMax;

			ret.push(newCoord);
		}

		return ret;
	}

	go(direction) {
		let delta = directionToDelta[direction];
		let changed = false;

		for (let startCoord of this.getGoSideCoords(direction)) {
			for (let blockCoord = startCoord; this.isValidCoord(...blockCoord);
				blockCoord = _.zipWith(blockCoord, delta, _.subtract)) {

				if (!this.has(...blockCoord)) continue;
				let block = this.get(...blockCoord);

				let ret = this.moveUntilMerge(block, ...delta);

				this.new.push(ret);
				changed = changed || ret;
			}
		}

		this.new = [];

		if (changed) {
			this.addRandomBlock();
			if (!this.check()) this.lose();
		}
	}
}
