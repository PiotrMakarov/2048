function zipSum(arr1, arr2) {
	return _.zipWith(arr1, arr2, _.add);
}

let directionToDelta = {
	up:    [0, -1],
	down:  [0,  1],
	left:  [-1, 0],
	right: [1,  0],
}

class Field extends FieldOperate {
	constructor(...args) {
		super(...args);
		this.lost = false;
	}

	moveDelta(block, dx, dy) {
		let coord = zipSum(this.getBlockCoord(block), [dx, dy]);
		this.move(block, ...coord);
	}

	merge(a, b) {
		if (a.innerText != b.innerText) return;

		let coord = this.getBlockCoord(b);
		let sum = _.sum([a, b].map(x => Number(x.innerText)));
		this.move(a, coord);
		this.delete(a);
		this.delete(b);
		this.add(coord, sum);
	}

	moveOrMerge(block, x, y) {
		if (this.has(x, y)) this.merge(block, this.get(x, y));
		else this.move(block, x, y);
	}

	getObstacleCoord(block, dx, dy) {
		let lastCoord = this.getBlockCoord(block);
		while (true) {
			let newCoord = zipSum(lastCoord, [dx, dy]);

			if (
				!this.isValidCoord(...newCoord) ||
				this.has(...newCoord)
			) return newCoord;

			lastCoord = newCoord;
		}
	}

	moveUntilMerge(block, dx, dy) {
		let coord = this.getObstacleCoord(block, dx, dy);
		if (this.has(...coord)) this.merge(block, this.get(...coord));
		else this.move(block, ...zipSum(coord, [dx, dy].map(x => x * -1)));
	}

	addRandomBlock() {
		let free = this.freeCoords;
		if (free.length == 0) return false;

		let coord = free[_.random(0, free.length-1)];
		let digit = _.random(1, 4) == 4 ? '4' : '2';

		this.add(...coord, digit);

		return true;
	}

	lose() {
		if (this.lost) return;
		this.sendMessage('Game over');
		this.lost = true;
	}

	go(direction) {
		let successful = this.addRandomBlock();
		if (!successful) this.lose();
	}
}
