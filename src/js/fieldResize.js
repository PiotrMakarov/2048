class FieldResize extends FieldMessage {
	alignBlocks() {
		for (let i = 0; i < this.params.width; i++) {
			for (let j = 0; j < this.params.height; j++) {
				if (this.blocks[i][j])
					this.move(this.blocks[i][j], i, j);
			}
		}
	}

	resize(width) {
		const ratio = Number((width / this.currentWidth).toFixed(3));

		for (let name of ['size', 'spacing']) {
			this[name] *= ratio;
			this[name] = Number(this[name].toFixed(1));
		}

		this.alignBlocks();
	}
}
