'use strict';

function resizeContainer(container) {
	let field = container.firstElementChild;

	['width', 'height'].forEach((property) => container.style[property] =
		field['offset' + _.capitalize(property)] + 'px');

	container.style.width = field.offsetWidth + 'px';
	container.style.height = field.offsetHeight + 'px';
}


let field = new Field(3,3);
let elem = field.render();

field.addRandomBlock();
field.addRandomBlock();

document.body.append(elem);

document.body.addEventListener('keydown', function (event) {
	if (!event.code.startsWith('Arrow')) return;

	let direction = event.code.slice(5).toLowerCase();

	field.go(direction);
})

resizeContainer(elem);
