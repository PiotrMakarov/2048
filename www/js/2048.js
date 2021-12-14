'use strict';

let appearance = Object.assign(
    defaultAppearance,
    (getJSONItem('appearance') || {}),
);
document.body.classList.add(appearance.theme); // light | dark | classic

let settings = getJSONItem('settings') || {};

let field = new Field(settings, appearance);

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
    window.screen.orientation.lock('portrait');

    StatusBar.hide();
    StatusBar.show();
    StatusBar.overlaysWebView(false);
    StatusBar.overlaysWebView(true);
    field.setBarTheme();
}

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

window.addEventListener('resize', () => field.adjustWindowSize());

document.fonts.ready.then(() => {
    document.body.append(field.elem);
});
