'use strict';

class FieldBase {
	constructor({width = 4, height = 4, startCount = 2, startPower = 1, winPower = 11}) {
		this.width = width;
		this.height = height;

		this.size = parseFloat(getRootCssVar('size'));
		this.spacing = parseFloat(getRootCssVar('spacing'));
		this.timeout = parseFloat(getRootCssVar('transition')) * 1000;
		this.timeoutMove = parseFloat(getRootCssVar('transition-move')) * 1000
		this.messageTimeout = 1000;

		this.startCount = startCount;
		this.startPower = startPower;
		this.winPower = winPower;
	}


	makeBGField() {
		let field = createDivClass('field', 'bg');

		setRootCssVar('width', this.width);
		setRootCssVar('height', this.height);

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

	makeMessage() {
		let message = createDivClass('message', 'hidden');
		return message;
	}

	makeContainer(width, height) {
		let container = createDivClass('container');

		let bgField = this.makeBGField(this.width, this.height);
		let field = this.makeField(this.width, this.height);
		let message = this.makeMessage();

		this.field = field;
		this.message = message;

		container.append(bgField);
		container.append(field);
		container.append(message);

		return container;
	}

	newGame() {
		this.clear();

		this.new = [];
		this.won = false;
		this.lost = false;
		this.paused = false;

		for (let i = 0; i < this.startCount; i++)
			this.addRandomBlock();
	}

	render() {
		this.elem = this.makeContainer();

		return this.elem;
	}
}
