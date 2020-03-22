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

	makeContainer(width, height) {
		let container = createDivClass('container');

		let bgField = this.makeBGField(this.width, this.height);
		let field = this.makeField(this.width, this.height);
		this.field = field;

		container.append(bgField);
		container.append(field);

		return container;
	}

	sendMessage(text, timeout) {
		this.message.innerText = text;
		this.elem.append(this.message);
		if (timeout) setTimeout(() => this.message.remove());
	}

	render() {
		this.elem = this.makeContainer();
		this.message = createDivClass('message');
		return this.elem;
	}
}
