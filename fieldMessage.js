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
<div class="horizontal-menu">
	<div>Size</div>
	<div class="horizontal-menu tight">
		<input type="number" name="width" value="${this.params.width}"> ×
		<input type="number" name="height" value="${this.params.height}">
	</div>
</div>
`;

		let namesToText = {
			startPower: 'Start power',
			winPower: 'Win power',
			startCount: 'Tiles count at start',
		};

		let names = ['width', 'height'];
		for (let name in namesToText) { names.push(name); }

		for (let name in namesToText) {
			let newElem = createDivClass('horizontal-menu');
			newElem.innerHTML =
`
<div>${namesToText[name]}</div>
<input type="number" name="${name}" value="${this.params[name]}">
`;
			settings.append(newElem);
		}

		let buttons = createDivClass('horizontal-menu');

		let saveButton = createDivClass('button');
		saveButton.innerText = 'Save';
		saveButton.addEventListener('click', () => {
			let newParams = {};
			for (let name of names) {
				newParams[name] = +settings[name].value;
			}
			this.newGame(newParams);
		})

		let defaultsButton = createDivClass('button');
		defaultsButton.innerText = 'Set defaults';
		defaultsButton.addEventListener('click', () => {
			for (let name of names) {
				settings[name].value = defaultParams[name];
			}
		})

		let closeButton = createDivClass('button');
		closeButton.innerText = 'Close';
		closeButton.addEventListener('click', () => this.hideMessage());

		buttons.append(saveButton, defaultsButton, closeButton);

		container.append(settings, buttons);

		this.sendMessage(container, {});
	}
}
