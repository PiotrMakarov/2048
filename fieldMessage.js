'use strict';

class FieldMessage extends FieldOperate {
	sendMessage(container, timeoutHide = 0, timeout = this.messageTimeout) {
		setTimeout(() => {
			this.paused = true;

			this.message.innerHTML = '';
			this.message.append(container);
			this.message.classList.remove('hidden');
		}, timeout);

		if (timeoutHide) setTimeout(() => this.hideMessage(), timeout + timeoutHide);
	}

	sendTextMessage(text, timeoutHide = 0, timeout = this.messageTimeout) {
		this.sendMessage(document.createTextNode(text), timeoutHide, timeout);
	}

	hideMessage() {
		this.paused = false;
		this.message.classList.add('hidden');
	}

	dialog(header, buttonsFuncs) {
		let container = createDivClass('message-container');
		container.append(document.createTextNode(header));

		let buttons = createDivClass('horizontal-menu');

		for (let buttonText in buttonsFuncs) {
			let button = createDivClass('button');
			button.innerText = buttonText;
			button.addEventListener('click', buttonsFuncs[buttonText]);
			button.addEventListener('click', () => this.hideMessage());
			buttons.append(button);
		}

		container.append(buttons);

		this.sendMessage(container);
	}

	lose() {
		if (this.lost) return;

		this.dialog('Game over!', {
			'New game': () => this.newGame(),
		})

		this.lost = true;
	}

	win() {
		if (this.won) return;

		this.dialog('You win!', {
			'New game': () => this.newGame(),
			'Continue': () => {},
		});

		this.won = true;
	}
}
