'use strict';

let field = new Field(2,4);
let elem = field.render();

field.addRandomBlock();
field.addRandomBlock();

document.body.append(elem);

document.body.addEventListener('keydown', function (event) {
	if (!event.code.startsWith('Arrow')) return;

	let direction = event.code.slice(5).toLowerCase();

	field.go(direction);
})
