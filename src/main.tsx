import * as React from 'react';
import * as ReactDOM from 'react-dom';

import NoteApp from './components/NoteApp';

declare namespace kintone.events {
    function on(event: string, handler: Function): void;
}

(() => {
    kintone.events.on('app.record.index.show', (event: any) => {
        // reset all elements
        const BODY_CLASS = 'body-top';
        const body: Element = document.getElementsByClassName(BODY_CLASS)[0];
        body.innerHTML = '';

        const container: Element  = document.createElement('DIV');
        body.appendChild(container);

        ReactDOM.render(<NoteApp />, container);
    });
})();
