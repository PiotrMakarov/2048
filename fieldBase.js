function createDivClass(...classNames){
	let elem = document.createElement('div');
	elem.classList.add(...classNames);
	return elem;
}

class FieldBase {
	constructor(width, height) {
		this.width = width;
		this.height = height;
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

	render() {
		this.elem = this.makeContainer();

		return this.elem;
	}
}
