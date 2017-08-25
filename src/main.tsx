import * as React from 'react';
import * as ReactDOM from 'react-dom';

import NoteRepository from './NoteRepository';
import KintoneNoteRepository from './KintoneNoteRepository';

// TODO 2.UI
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);

const repository: NoteRepository = new KintoneNoteRepository();
console.log(repository.getAll());