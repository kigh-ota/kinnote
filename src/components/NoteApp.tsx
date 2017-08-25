import * as React from 'react';
import KintoneNoteRepositoryConfig from '../KintoneNoteRepositoryConfig';
import KintoneNoteRepository from '../KintoneNoteRepository';
import myConfig from '../MyConfig';
import Note from '../Note';

interface Props {
}

interface State {
    notes: Note[];
}

export default class NoteApp extends React.PureComponent<Props, State> {
    constructor() {
        super();
        this.state = {
            notes: [],
        };


        const noteRepository = new KintoneNoteRepository(myConfig);
        noteRepository.getAll().then(notes => {
            this.setState({notes: notes});
        });
        // repository.get(1).then(note => console.log(note));
        // repository.get(99999).then(note => console.log(note));
    }

    render() {
        const titles = this.state.notes.map(note => (<li key={`${note.getId()}`}>{note.getTitle()}</li>));
        return (<ul>{titles}</ul>);
    }
}