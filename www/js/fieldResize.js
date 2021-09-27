class FieldResize extends FieldBase {
    constructor(...args) {
        super(...args);
        this.lastIsResize = false;
        this.lastIsTextAbsolute = null;
        this.defaultValuesSet = false;
        this.default4x4FieldWidth = fieldSize(4,
            parseInt(getRootCssVar('default-size')),
            parseInt(getRootCssVar('default-spacing'))
        );
    }

    alignBlocks() {
        for (let i = 0; i < this.params.width; i++) {
            for (let j = 0; j < this.params.height; j++) {
                if (this.blocks[i][j])
                    this.move(this.blocks[i][j], i, j);
            }
        }
    }

    resize(newFieldSize, direction) {
        const ratio = newFieldSize / this.currentFieldSize(direction);

        const names = ['size', 'spacing'];

        for (let name of names) {
            // maybe it's better not to round
            this[name] = _.round(this[name] * ratio, 1);
        }

        const isTextAbsolute = newFieldSize >= this.default4x4FieldWidth;
        if (isTextAbsolute != this.lastIsTextAbsolute) {
            if (isTextAbsolute) {
                setRootCssVar('default-spacing', '13px');
            } else {
                setRootCssVar('default-spacing', '2.6vw');
            }
        }
        this.lastIsTextAbsolute = isTextAbsolute;

        this.alignBlocks();
    }

    getWidthByHeight(height) {
        const ratio = this.defaultFieldSizes.width
            / this.defaultFieldSizes.height;

        return ratio * height;
    }

    adjustWindowSize() {
        const paddingRatio = .06;
        // Differencies between window and field (with buttons) sizes
        const diffs = {
            width: window.innerWidth * paddingRatio,
            height: window.innerHeight * paddingRatio
                + this.menu.offsetHeight,
        };

        let dir;
        let minWidth = Infinity;
        let newFieldSize;
        for (let direction in diffs) {
            const windowSize = window['inner' + _.capitalize(direction)];
            const currentNewFieldSize = windowSize - diffs[direction];

            let width;
            if (direction == 'width') {
                width = currentNewFieldSize;
            } else {
                width = this.getWidthByHeight(currentNewFieldSize);
            }

            if (width < minWidth) {
                minWidth = width;
                newFieldSize = currentNewFieldSize;
                dir = direction;
            }
        }

        const isResize = newFieldSize <= this.defaultFieldSizes[dir];
        if (isResize) {
            this.resize(newFieldSize, dir);
        }
        else if (this.lastIsResize) { // return to default size
            this.resize(this.defaultFieldSizes[dir], dir);
        }
        this.lastIsResize = isResize;
    }
}
