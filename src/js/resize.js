let lastIsResize = false;

function resize(field) {
	const padding = 15;
	const minWindowWidth = field.defaultWidth + padding;
	const isResize = window.innerWidth <= minWindowWidth;

	if (isResize) {
		field.resize(window.innerWidth - padding);
	} else if (lastIsResize != isResize) {
		field.resize(field.defaultWidth);
	}

	lastIsResize = isResize;
}
