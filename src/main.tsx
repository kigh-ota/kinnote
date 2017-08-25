import * as React from 'react';
import * as ReactDOM from 'react-dom';

import NoteRepository from './NoteRepository';
import KintoneNoteRepository from './KintoneNoteRepository';
import NoteApp from './components/NoteApp';

// TODO 2.UI
ReactDOM.render(
  <NoteApp />,
  document.getElementById('root')
);
