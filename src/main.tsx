import * as React from 'react';
import * as ReactDOM from 'react-dom';

import NoteRepository from './NoteRepository';
import KintoneNoteRepository from './KintoneNoteRepository';
import myConfig from './MyConfig';

// TODO 2.UI
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);

const repository: NoteRepository = new KintoneNoteRepository(myConfig);
console.log(repository.getAll());