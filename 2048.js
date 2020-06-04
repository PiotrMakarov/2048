'use strict';

let darkTheme = getJSONCookie('darkTheme') || false;
if (darkTheme) document.body.classList.add('dark');

let settings = getJSONCookie('settings');
if (settings == undefined) settings = {};

let field = new Field(settings, darkTheme);

let lastCoord = null;
document.body.addEventListener('touchstart', function (event) {
	let touch = event.touches[0];
	lastCoord = [touch.pageX, touch.pageY];
});

document.body.addEventListener('touchmove', function (event) {
	if (lastCoord == null) return;

	let touch = event.touches[0];
	let newCoord = [touch.pageX, touch.pageY];
	let delta = _.zipWith(newCoord, lastCoord, _.subtract);
	let direction = deltaToDirection(...delta);

	if (direction != null) field.go(direction);
	lastCoord = null;
});

document.body.addEventListener('keydown', function (event) {
	if (!event.code.startsWith('Arrow')) return;

	let direction = event.code.slice(5).toLowerCase();

	field.go(direction);
});

document.fonts.ready.then(() => document.body.append(field.elem));
window.onunload = () => {
	if (field.lost) {
		setJSONCookie('blocks', null);
		field.lost = false;
	} else field.makeBlocksCookie();
	setJSONCookie('settings', field.params);
	setJSONCookie('lastStep', field.lastStep);
	setJSONCookie('backPressed', field.backPressed);
	setJSONCookie('darkTheme', field.darkTheme);
	setJSONCookie('won', field.won);
	setJSONCookie('lost', field.lost);
};
