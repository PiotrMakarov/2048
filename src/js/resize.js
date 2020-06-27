let lastIsResize = false;

function resize(field) {
	const isResize = window.innerWidth <= field.defaultWidth + field.spacing * 2;

	if (isResize) {
		field.resize(window.innerWidth - field.spacing * 2);
	} else if (lastIsResize != isResize) {
		field.resize(field.defaultWidth);
	}

	lastIsResize = isResize;
}
