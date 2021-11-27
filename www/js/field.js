'use strict';

class Field extends FieldMessage {
    constructor(...args) {
        super(...args);
        this.newGame({}, false);
        this.new = [];
    }

    getObstacleCoord(block, dx, dy) {
        let lastCoord = this.getBlockCoord(block);
        while (true) {
            let newCoord = _.zipWith(lastCoord, [dx, dy], _.add);

            if (
                !this.isValidCoord(...newCoord) ||
                this.has(...newCoord)
            ) return newCoord;

            lastCoord = newCoord;
        }
    }

    moveUntilMerge(block, dx, dy) {
        let coord = this.getObstacleCoord(block, dx, dy);
        let preCoord = _.zipWith(coord, [dx, dy], _.subtract);

        let merged = false;
        let moved = !_.isEqual(this.getBlockCoord(block), preCoord);

        if (this.has(...coord)) {
            let mergeBlock = this.get(...coord);
            if (!this.new.includes(mergeBlock))
                merged = this.merge(block, mergeBlock, true);
        }
        if (!merged) this.move(block, ...preCoord, true);

        return merged || moved;
    }

    addRandomBlock(write = false) {
        let free = this.freeCoords;
        if (free.length == 0) return false;

        let coord = free[_.random(0, free.length-1)];
        let power = this.params.startPower;
        if (_.random(1, 10) == 1) power++;
        let digit = 2 ** power;

        let newBlock = this.add(...coord, digit);

        if (write) {
            this.newStep.push({
                type: 'add',
                coord: coord
            });
        }

        return true;
    }

    isMergeable(x, y) {
        let text;
        if (this.has(x, y)) text = this.getCoordText(x, y);
        else return false;

        let ret = false;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (!( [dx, dy].includes(0) && !_.isEqual([dx, dy], [0, 0]) )) continue;

                let [nx, ny] = [x + dx, y + dy];
                if (!this.has(nx, ny)) continue;
                ret = ret || text == this.getCoordText(nx, ny);
            }
        }

        return ret;
    }

    check() {
        let ret = false;

        for (let i = 0; i < this.params.width; i++) {
            for (let j = 0; j < this.params.height; j++) {
                if (this.blocks[i][j] == null) continue;
                ret = ret || this.isMergeable(i, j);
            }
        }

        return ret || this.freeCoords.length != 0;
    }

    getGoSideCoords(direction) {
        let ret = [];

        let delta = directionToDelta[direction];

        let iIndex = delta.indexOf(0);
        let maxIndex = Number(!Boolean(iIndex));

        let max = [this.params.width, this.params.height][iIndex];
        let retMax = delta[maxIndex] == 1
            ? [this.params.width, this.params.height][maxIndex]-1
            : 0;

        for (let i = 0; i < max; i++) {
            let newCoord = new Array(2);

            newCoord[iIndex] = i;
            newCoord[maxIndex] = retMax;

            ret.push(newCoord);
        }

        return ret;
    }

    go(direction) {
        if (this.messageShownType) return;
        this.newStep = [];

        let delta = directionToDelta[direction];
        let changed = false;

        for (let startCoord of this.getGoSideCoords(direction)) {
            for (let blockCoord = startCoord; this.isValidCoord(...blockCoord);
                blockCoord = _.zipWith(blockCoord, delta, _.subtract)) {

                if (!this.has(...blockCoord)) continue;
                let block = this.get(...blockCoord);

                let ret = this.moveUntilMerge(block, ...delta);

                this.new.push(ret);
                changed = changed || ret;
            }
        }

        this.new = [];

        if (changed) {
            this.addRandomBlock(true);
            if (!this.check()) {
                this.lost = true;
                this.lose();
            }
            this.lastSteps.push(this.newStep);
            this.undoButton.classList.remove('disabled');
            setJSONItem('lastSteps', this.lastSteps);
            this.saveBlocks();
        }
    }

    unmerge(a, b) {
        let mergeResult = this.get(...a);
        let valueBeforeMerge = +mergeResult.innerText / 2;

        this.delete(mergeResult, true, 'unmerge');
        this.add(...a, valueBeforeMerge);
        let blockToMove = this.add(...a, valueBeforeMerge, false, false);
        blockToMove.classList.add('unmerge-move')
        setTimeout(() => this.move(blockToMove, ...b));
    }

    undo() {
        if (this.lastSteps.length == 0)
            return;

        this.lost = false;

        if (this.messageShownType == 'win')
            this.won = false;
        this.hideMessage();
        this.undone++;

        const lastStep = this.lastSteps.pop();
        setJSONItem('lastSteps', this.lastSteps);

        if (this.lastSteps.length == 0)
            this.undoButton.classList.add('disabled');

        lastStep.reverse();
        for (let action of lastStep) {
            if (action.type == 'add')
                this.delete(this.get(...action.coord), true, 'delete');
            else if (action.type == 'move')
                this.move(this.get(...action.new), ...action.old);
            else if (action.type == 'merge')
                this.unmerge(action.new, action.old);
        }

        setTimeout(() => this.saveBlocks());
    }
}
