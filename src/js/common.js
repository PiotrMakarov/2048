'use strict';

let directionToDelta = {
    up:    [0, -1],
    down:  [0,  1],
    left:  [-1, 0],
    right: [1,  0],
};

let deltaToDirectionArr = [];
for (let direction in directionToDelta) {
    let pair = [directionToDelta[direction], direction];
    deltaToDirectionArr.push(pair);
}

function signDeltaToDirection(dx, dy) {
    for (let pair of deltaToDirectionArr) {
        let [delta, direction] = pair;
        if (_.isEqual(delta, [dx, dy])) return direction;
    }
    return null;
}

function deltaToDirection(dx, dy) {
    let delta = [dx, dy];
    delta[delta.indexOf(_.minBy(delta, Math.abs))] = 0;
    delta = delta.map(Math.sign);

    for (let direction in directionToDelta) {
        if (_.isEqual(directionToDelta[direction], delta))
            return direction;
    }

    return null;
}

function empty2DArray(x, y, value) {
    let ret = [];
    for (let i = 0; i < x; i++) {
        ret.push([]);
        for (let j = 0; j < y; j++) {
            ret[i].push(null);
        }
    }

    return ret;
}

function applyCustomParams(default_, current, new_) {
    let assignTarget = current || default_;
    return Object.assign(Object.assign({}, assignTarget), new_);
}

function fieldSize(size, cellSize, spacing) {
    return size * cellSize + spacing * (size + 1);
}

function createDivClass(...classNames){
    let elem = document.createElement('div');
    elem.classList.add(...classNames);
    return elem;
}

function getJSONItem(name) {
    let ret = localStorage.getItem(name);
    if (ret != null) {
        return JSON.parse(ret);
    }
    return null;
}

function setJSONItem(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}

function getRootCssVar(name) {
    return getComputedStyle(document.documentElement).getPropertyValue('--' + name);
}

function setRootCssVar(name, value) {
    document.documentElement.style.setProperty('--' + name, value);
}
