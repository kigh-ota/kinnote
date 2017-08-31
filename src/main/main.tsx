import * as React from 'react';
import * as ReactDOM from 'react-dom';

import NoteApp from './application/NoteApp';
import NoteService from './domain/model/NoteService';

// TODO: list tags
// TODO: resize NoteSelector
// TODO: measure code coverage
// TODO: save sort type

(() => {
    if (location.hash === '#note') {
        kintone.events.on('app.record.index.show', (event: any) => {
            // reset all elements
            const BODY_CLASS = 'body-top';
            const body: Element = document.getElementsByClassName(BODY_CLASS)[0];
            body.innerHTML = '';

            const container: Element = document.createElement('DIV');
            body.appendChild(container);

            NoteService.getInstance().init().then(() => {
                ReactDOM.render(<NoteApp/>, container);
            });
        });
    }
})();
