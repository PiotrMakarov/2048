'use strict';

function resizeContainer(container) {
	let field = container.firstElementChild;

	['width', 'height'].forEach((property) => container.style[property] =
		field['offset' + _.capitalize(property)] + 'px');

	container.style.width = field.offsetWidth + 'px';
	container.style.height = field.offsetHeight + 'px';
}


let field = new Field(4, 4);
let elem = field.render();

field.add(0, 0, '2');
field.add(2, 0, '2');

let a = field.get(0, 0);
let b = field.get(2, 0);

document.body.append(elem);

document.body.addEventListener('keydown', function (event) {
	if (!event.code.startsWith('Arrow')) return;

	let direction = event.code.slice(5).toLowerCase();

	field.go(direction);
})

resizeContainer(elem);
