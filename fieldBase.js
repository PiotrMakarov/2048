'use strict';

class FieldBase {
	constructor(args, darkTheme) {
		this.elem = null;

		this.setParams(args);

		this.darkTheme = darkTheme;

		this.size = parseFloat(getRootCssVar('size'));
		this.spacing = parseFloat(getRootCssVar('spacing'));
		this.timeout = parseFloat(getRootCssVar('transition')) * 1000;
		this.timeoutMove = parseFloat(getRootCssVar('transition-move')) * 1000;
		this.messageTimeout = 1000;
	}

	setParams(args) {
		let paramsToSet = this.params == undefined
			? Object.assign(Object.assign({}, defaultParams), args)
			: Object.assign(Object.assign({}, this.params), args);

			this.params = paramsToSet;
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

		let menu = createDivClass('horizontal-menu');
		let leftButtons = createDivClass('horizontal-menu');
		let rightButtons = createDivClass('horizontal-menu');

		let newGameButton = createDivClass('button');
		newGameButton.addEventListener('click', () => {
			this.newGame({});
		});
		newGameButton.innerText = 'New game';

		this.backButton = createDivClass('button');
		this.backButton.innerText = 'Back';
		this.backButton.addEventListener('click', () => {
			if (this.backButton.classList.contains('disabled'))
				return;

			this.back();
			this.backButton.classList.add('disabled');
		});

		let settingsButton = createDivClass('button');
		settingsButton.innerText = 'Settings';
		settingsButton.addEventListener('click', () => this.settings());

		leftButtons.append(newGameButton, this.backButton);

		rightButtons.append(settingsButton);

		menu.append(leftButtons, rightButtons);

		let fieldContainer = this.makeFieldContainer();
		container.append(menu, fieldContainer);

		return container;
	}

	addRandomBlocks() {
		for (let i = 0; i < this.params.startCount; i++)
			this.addRandomBlock();
	}

	newGame(args) {
		this.clear();

		this.setParams(args);

		let newElem = this.makeContainer();

		this.new = [];
		this.paused = false;
		this.settingsOpened = false;

		if (!this.elem) { // first game
			this.elem = newElem;
			this.lastStep = getJSONCookie('lastStep') || [];
			this.backPressed = getJSONCookie('backPressed') || 0;
			this.won = getJSONCookie('won') || false;
			this.lost = getJSONCookie('lost') || false;
			let oldBlocks = getJSONCookie('blocks');
			if (oldBlocks) this.fillWithBlocks(oldBlocks);
			else this.addRandomBlocks();
		} else {
			this.elem.replaceWith(newElem);
			this.elem = newElem;
			this.lastStep = [];
			this.backPressed = 0;
			this.won = false;
			this.lost = false;
			this.addRandomBlocks();
		}

		this.hideMessage();

		if (this.lastStep.length == 0)
			this.backButton.classList.add('disabled');

		return this.elem;
	}
}
