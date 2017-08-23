import * as React from 'react';
import * as ReactDOM from 'react-dom';

import NoteRepository from './NoteRepository';

ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('root')
);

const repository: NoteRepository = new NoteRepository();
console.log(repository.getAll());