'use strict';

class FieldMessage extends FieldOperate {
	sendMessage(container, {hideDelay = 0, showDelay = 0}) {
		setTimeout(() => {
			this.paused = true;

			this.message.innerHTML = '';
			this.message.append(container);
			this.message.classList.remove('hidden');
		}, showDelay);

		if (hideDelay) setTimeout(() => this.hideMessage(), showDelay + hideDelay);
	}

	hideMessage() {
		this.paused = false;
		this.message.classList.add('hidden');
	}

	dialog(headerText, text, buttonsFuncs, kwargs) {
		let container = createDivClass('message-container');

		let header = document.createElement('h1');
		header.innerText = headerText;
		container.append(header);
		if (text)
			container.append(document.createTextNode(text));

		let buttons = createDivClass('horizontal-menu');

		for (let buttonText in buttonsFuncs) {
			let button = createDivClass('button');
			button.innerText = buttonText;
			button.addEventListener('click', buttonsFuncs[buttonText]);
			button.addEventListener('click', () => this.hideMessage());
			buttons.append(button);
		}

		container.append(buttons);

		this.sendMessage(container, kwargs);
	}

	lose() {
		if (this.lost) return;

		this.dialog('Game over!', '', {
			'New game': () => this.newGame({}),
		}, {showDelay: this.messageTimeout})

		this.lost = true;
	}

	win() {
		if (this.won) return;

		this.dialog('You win!', '', {
			'New game': () => this.newGame({}),
			'Continue': () => {},
		}, {showDelay: this.messageTimeout});

		this.won = true;
	}

	settings() {
		let container = createDivClass('message-container');

		let settings = document.createElement('form');
		settings.classList.add('settings');
		settings.name = 'settings';
		settings.innerHTML = 
`
<div>
	<div>Size</div>
	<input type="number" name="width" value="${this.params.width}"> ×
	<input type="number" name="height" value="${this.params.height}">
</div>
<div>
	<div>Start power</div>
	<input type="number" name="start-power" value="${this.params.startPower}">
</div>
<div>
	<div>Win power</div>
	<input type="number" name="win-power" value="${this.params.winPower}">
</div>
`;

		for (let elem of settings.children) {
			elem.classList.add('horizontal-menu');
		}

		let buttons = createDivClass('horizontal-menu');

		let saveButton = createDivClass('button');
		saveButton.innerText = 'Save';
		saveButton.addEventListener('click', () => {
			let newParams = {};
			[newParams.startPower, newParams.winPower, newParams.width, newParams.height] =
				['start-power', 'win-power', 'width', 'height'].map(x => +settings[x].value);
			this.newGame(newParams);
		})

		let closeButton = createDivClass('button');
		closeButton.innerText = 'Close';
		closeButton.addEventListener('click', () => this.hideMessage());

		buttons.append(saveButton, closeButton);

		container.append(settings, buttons);

		this.sendMessage(container, {});
	}
}
