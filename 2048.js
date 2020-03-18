'use strict';

function createDivClass(...classNames){
	let elem = document.createElement('div');
	elem.classList.add(...classNames);
	return elem;
}

function makeBGField(width, height) {
	let field = createDivClass('field', 'bg');

	let s = document.documentElement.style;
	s.setProperty('--width', width);
	s.setProperty('--height', height);


	for (let i = 0; i < width * height; i++) {
		let block = createDivClass('block');
		field.append(block);
	}

	return field;
}

function makeField(width, height) {
	let field = createDivClass('field');

	field.width = width;
	field.height = height;

	return field;
}

function addRandomBlock(field) {
	let coord = [];
	[field.width, field.height] = [4, 4];
	[field.width, field.height].forEach(function (value) {
		coord.push(_.random(1, value));
	});
	console.log(coord);

	let block = createDivClass('block');
	block.style['grid-area'] = coord.join(' / ');
	block.innerText = '2';

	field.append(block);
}

function makeContainer(width, height) {
	let container = createDivClass('container');

	let bgField = makeBGField(4, 4);
	let field = makeField(4, 4);
	addRandomBlock(field);
	addRandomBlock(field);

	container.append(bgField);
	container.append(field);

	return container;
}

function resizeContainer(container) {
	let field = container.firstElementChild;

	['width', 'height'].forEach((property) => container.style[property] =
		field['offset' + _.capitalize(property)] + 'px');

	container.style.width = field.offsetWidth + 'px';
	container.style.height = field.offsetHeight + 'px';
}

function center(...selectors) {
	for (let selector of selectors) {
		for (let elem of document.querySelectorAll(selector)) {
			elem.classList.add('center');
		}
	}
}

let container = makeContainer(4, 4);
document.body.append(container);
resizeContainer(container);
center('body', '.block');
