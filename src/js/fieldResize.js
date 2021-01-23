class FieldResize extends FieldBase {
	constructor(...args) {
		super(...args);
		this.lastIsResize = false;
	}

	alignBlocks() {
		for (let i = 0; i < this.params.width; i++) {
			for (let j = 0; j < this.params.height; j++) {
				if (this.blocks[i][j])
					this.move(this.blocks[i][j], i, j);
			}
		}
	}

	resize(width) {
		const ratio = width / this.currentWidth;

		for (let name of ['size', 'spacing']) {
			this[name] = _.round(this[name] * ratio, 1);
		}

		this.alignBlocks();
	}

	adjustWindowSize() {
		const padding = 15;
		const minWindowWidth = this.defaultWidth + padding;
		const isResize = window.innerWidth <= minWindowWidth;

		if (isResize) {
			this.resize(window.innerWidth - padding);
		} else if (this.lastIsResize != isResize) {
			this.resize(field.defaultWidth);
		}

		this.lastIsResize = isResize;
	}
}
