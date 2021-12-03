'use strict';

class FieldBase {
    constructor(...args) {
        this.elem = null;

        this.setParams(...args);
        this.setDefaultFieldSizes();

        const loadFunction = parseFloat;
        const dumpFunction = x => x + 'px';

        for (let name of ['undone', 'won', 'lost']) {
            this.bindJSONItem(name);
        }
        this.bindCssVar('size', loadFunction, dumpFunction);
        this.bindCssVar('spacing', loadFunction, dumpFunction);
        this.timeout = parseFloat(getRootCssVar('transition')) * 1000;
        this.timeoutMove = parseFloat(getRootCssVar('transition-move')) * 1000;
        this.messageTimeout = 1000;
    }

    setParams(params, appearance) {
        this.params = applyCustomParams(
            defaultParams,
            this.params,
            params
        );
        this.appearance = applyCustomParams(
            defaultAppearance,
            this.appearance,
            appearance
        );
    }

    setDefaultFieldSizes() {
        this.defaultFieldSizes = {};
        for (let direction of ['height', 'width']) {
            this.defaultFieldSizes[direction] = fieldSize(this.params[direction],
            parseFloat(getRootCssVar('default-size')),
            parseFloat(getRootCssVar('default-spacing')));
        }
    }

    bindCssVar(name, loadFunction, dumpFunction) {
        Object.defineProperty(this, name, {
            get: () => loadFunction(getRootCssVar(name)),
            set: value => setRootCssVar(name, dumpFunction(value))
        })
    }

    bindJSONItem(name) {
        Object.defineProperty(this, name, {
            set(value) {
                this['_' + name] = value;
                setJSONItem(name, value);
            },
            get() {
                return this['_' + name];
            }
        })
    }

    makeBGField() {
        let field = createDivClass('field', 'bg');

        setRootCssVar('width', this.params.width);
        setRootCssVar('height', this.params.height);

        for (let i = 0; i < this.params.width * this.params.height; i++) {
            let block = createDivClass('block');
            field.append(block);
        }

        return field;
    }

    makeField() {
        let field = createDivClass('field');

        return field;
    }

    makeMessage() {
        let message = createDivClass('message', 'hidden');
        return message;
    }

    makeFieldContainer() {
        let container = createDivClass('field-container');

        let bgField = this.makeBGField(this.params.width, this.params.height);
        let field = this.makeField(this.params.width, this.params.height);
        let message = this.makeMessage();

        this.field = field;
        this.message = message;

        container.append(bgField);
        container.append(field);
        container.append(message);

        return container;
    }

    makeContainer() {
        let container = createDivClass('container');

        this.menu = createDivClass('horizontal-menu', 'menu-bar');
        let leftButtons = createDivClass('horizontal-menu');
        let rightButtons = createDivClass('horizontal-menu');

        let newGameButton = createDivClass('button');
        newGameButton.addEventListener('click', () => {
            this.newGame({});
        });
        newGameButton.innerText = 'New game';

        this.undoButton = createDivClass('button');
        this.undoButton.innerText = 'Undo';
        this.undoButton.addEventListener('click', () => this.undo());

        let settingsButton = createDivClass('button');
        settingsButton.innerText = 'Settings';
        settingsButton.addEventListener('click', () => this.settings());

        leftButtons.append(newGameButton, this.undoButton);

        rightButtons.append(settingsButton);

        this.menu.append(leftButtons, rightButtons);

        let fieldContainer = this.makeFieldContainer();
        container.append(this.menu, fieldContainer);

        return container;
    }

    addRandomBlocks() {
        for (let i = 0; i < this.params.startCount; i++)
            this.addRandomBlock();

        this.saveBlocks();
    }

    makeBlocks() {
        this.blocks = empty2DArray(this.params.width, this.params.height, null);
    }

    setBarTheme() {
        let bgColor;
        let dark;
        if (this.appearance.theme == 'light') {
            bgColor = '#FFFFFF';
            dark = true;
        } else if (this.appearance.theme == 'dark') {
            bgColor = '#121212';
            dark = false;
        } else if (this.appearance.theme == 'classic') {
            bgColor = '#FAF8EF';
            dark = true;
        }

        if (dark) {
            StatusBar.styleDefault();
            // TransparentNavigationBar.setNavigationBarButtonsColor('dark');
        } else {
            StatusBar.styleLightContent();
            // TransparentNavigationBar.setNavigationBarButtonsColor('light');
        }

        NavigationBar.backgroundColorByHexString(bgColor, dark);
        StatusBar.backgroundColorByHexString(bgColor);
        window.plugins.headerColor.tint(bgColor);
    }

    newGame(args, dialog = true) {
        if (dialog) {
            this.dialog('Start new game?', false, {
                'Yes': () => this.newGameBody(args),
                'No': () => {},
            }, {}, .8);
        } else this.newGameBody(args);
    }

    newGameBody(args) {
        this.clear();

        this.setParams(args);
        this.setDefaultFieldSizes();

        let newElem = this.makeContainer();

        this.new = [];
        this.messageShownType = null;
        this.lastIsTextAbsolute = null;

        if (!this.elem) { // first game
            this.elem = newElem;
            this.lastSteps = getJSONItem('lastSteps') || [];
            this.undone = getJSONItem('undone') || 0;
            this.won = getJSONItem('won') || false;
            this.lost = getJSONItem('lost') || false;
            if (this.lost) this.lose();
            let oldBlocks = getJSONItem('blocks');
            if (oldBlocks) this.fillWithBlocks(oldBlocks);
            else this.addRandomBlocks();
        } else {
            this.elem.replaceWith(newElem);
            this.elem = newElem;
            this.lastSteps = [];
            setJSONItem('lastSteps', []);
            this.undone = 0;
            this.won = false;
            this.lost = false;
            this.makeBlocks();
            this.addRandomBlocks();
        }

        if (this.lastSteps.length == 0) {
            this.undoButton.classList.add('disabled');
        } else {
            this.undoButton.classList.remove('disabled');
        }

        this.hideMessage();

        setTimeout(() => {
            this.adjustWindowSize();
        }, 0);

        return this.elem;
    }
}
