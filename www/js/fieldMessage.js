'use strict';

class FieldMessage extends FieldOperate {
    sendMessage(container, {
        hideDelay = 0,
        showDelay = 0,
        type = 'other'
    }) {
        setTimeout(() => {
            this.messageShownType = type;

            this.message.innerHTML = '';
            this.message.append(container);
            this.message.classList.remove('hidden');
        }, showDelay);

        if (hideDelay) setTimeout(() => this.hideMessage(), showDelay + hideDelay);
    }

    hideMessage() {
        this.messageShownType = null;
        this.message.classList.add('hidden');

        setTimeout(() => {
            const container = document.querySelector('.message-container');
            if (container !== null) {
                container.classList = ['message-container'];
            }
        }, parseFloat(getRootCssVar('transition')) * 1000);
    }

    dialog(headerText, text, buttonsFuncs, kwargs, textSizeCoeff = 1) {
        let container = createDivClass('message-container', 'dialog');

        let header = document.createElement('h1');
        header.innerText = headerText;
        header.style.fontSize = `calc(var(--font-size) * 2.5 * ${textSizeCoeff}`;
        container.append(header);
        if (text) {
            let textElem = document.createElement('div');
            textElem.innerText = text;
            container.append(textElem);
        }

        let buttons = createDivClass('horizontal-menu', 'buttons');

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
        this.dialog('Game over!', '', {
            'New game': () => this.newGame({}, false),
        }, {}, 1.2);
    }

    win() {
        if (this.won) return;

        let countStr = this.undone ? this.undone : 'no';
        let moves = this.undone == 1 ? 'move' : 'moves';

        let undoMessage = `You've undone ${countStr} ${moves}`;

        this.dialog('You win!', undoMessage, {
            'New game': () => this.newGame({}),
            'Continue': () => {},
        }, {type: 'win'});

        this.won = true;
    }

    setMenuBarTheme() {
        if (this.appearance.theme == 'dark') {
            StatusBar.styleBlackOpaque();
        } else {
            StatusBar.styleDefault();
        }
    }

    settings() {
        if (this.messageShownType == 'settings') {
            this.hideMessage();
            return;
        }

        let container = createDivClass('message-container');

        let settings = document.createElement('form');
        settings.classList.add('settings');
        settings.name = 'settings';
        settings.innerHTML = 
`
<div class="horizontal-menu">
    <div>Size</div>
    <div class="horizontal-menu">
        <input type="number" name="width" value="${this.params.width}"> ×
        <input type="number" name="height" value="${this.params.height}">
    </div>
</div>
`;

        // Rules for blocking input on field size
        for (let el of settings.querySelectorAll('input')) {
            el.addEventListener('input', event => {
                // Forbid zero as first digit
                if (event.target.value == '0') {
                    event.target.value = '';
                }

                // Restrict the input of field size to be maximum 2 digits
                if (event.target.value.length > 2) {
                    event.target.value = event.target.value.slice(0, 2);
                }
            })
        }

        let namesToText = {
            // startPower: 'Start power',
            // winPower: 'Win power',
            // startCount: 'Tiles count at start',
        };

        let names = ['width', 'height'];
        for (let name in namesToText) names.push(name);

        for (let name in namesToText) {
            let newElem = createDivClass('horizontal-menu');
            newElem.innerHTML =
`
<div>${namesToText[name]}</div>
<input type="number" name="${name}" value="${this.params[name]}">
`;
            settings.append(newElem);
        }

        let theme = createDivClass('horizontal-menu');
        theme.innerHTML =
`
<div>Theme</div>
<div id="theme" style="
    margin: 0 calc(var(--interface-spacing) * .8);
    cursor: pointer;
"></div>
`;
        settings.append(theme);
        const themeButton = theme.querySelector('#theme');
        themeButton.innerText = _.capitalize(this.appearance.theme);

        let themeIndex = consts.themes.indexOf(this.appearance.theme);
        themeButton.addEventListener('click', () => {
            themeIndex++;
            this.appearance.theme = consts.themes[themeIndex % consts.themes.length];
            themeButton.innerText = _.capitalize(this.appearance.theme);
            this.updateBlockTheme();
            setJSONItem('appearance', this.appearance);

            document.body.classList.remove(...consts.themes);
            document.body.classList.add(this.appearance.theme);
            this.setMenuBarTheme();
        });

        let buttons = createDivClass('horizontal-menu', 'buttons');

        let saveButton = createDivClass('button');
        saveButton.innerText = 'Save';
        saveButton.addEventListener('click', () => {
            const s = settings.width.value * settings.height.value;
            let msg = '';
            if (s < 3) msg = 'Field is too small';
            else if (s > 900) msg = 'Field is too big';
            if (msg) {
                this.dialog(msg, false, {
                    'Ok': () => this.settings(),
                }, {}, .7)
                return;
            }

            let newParams = {};
            for (let name of names) {
                newParams[name] = +settings[name].value;
            }

            if (_.isEqual(_.pick(this.params, 'width', 'height'), newParams)) {
                this.hideMessage();
            } else {
                setJSONItem('settings', newParams);
                this.newGame(newParams)
            };
        });

        // let defaultsButton = createDivClass('button');
        // defaultsButton.innerText = 'Set defaults';
        // defaultsButton.addEventListener('click', () => {
        //     for (let name of names) {
        //         settings[name].value = defaultParams[name];
        //     }
        // });

        let closeButton = createDivClass('button');
        closeButton.innerText = 'Close';
        closeButton.addEventListener('click', () => this.hideMessage());

        buttons.append(saveButton, /*defaultsButton,*/ closeButton);

        container.append(settings, buttons);

        this.sendMessage(container, {type: 'settings'});
    }
}
