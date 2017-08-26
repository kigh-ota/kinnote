import * as React from 'react';
import Note from '../Note';
import NoteSelector from './NoteSelector';
import {getMuiTheme, lightBaseTheme, MuiThemeProvider} from 'material-ui/styles';
import NoteService from '../NoteService';
import NoteEditor from './NoteEditor';
import update = require('immutability-helper');

export const AppStyles = {
    textBase: {
        fontFamily: 'Monaco, monospace',
        fontSize: 12,
    }
};

interface Props {
}

interface State {
    notes: NoteState[];
    noteInEdit: NoteState;
}

type NoteStateId = number | null;

// Use this object type instead of the original Note entity class to make state as simple as possible.
export interface NoteState {
    id: NoteStateId;
    title: string;
    body: string;
}

function toNoteState(note: Note): NoteState {
    return {
        id: note.getId(),
        title: note.getTitle(),
        body: note.getBody(),
    };
}

export default class NoteApp extends React.PureComponent<Props, State> {
    constructor() {
        super();
        this.state = {
            notes: [],
            noteInEdit: toNoteState(Note.emptyNote()),
        };

        NoteService.getAll().then(notes => {
            this.setState({notes: notes.map(note => toNoteState(note))});
        });
    }


    private getNoteStateById(id: NoteStateId): NoteState {
        if (id === null) {
            throw new Error();
        }
        const note = this.state.notes.find((note: NoteState) => note.id === id);
        if (note === undefined) {
            throw new Error();
        }
        return note;
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div>
                    <NoteSelector
                        notes={this.state.notes}
                        onSelectNote={id => {
                            this.setState({noteInEdit: this.getNoteStateById(id)});
                        }}
                    />
                    <NoteEditor
                        id={this.state.noteInEdit.id}
                        title={this.state.noteInEdit.title}
                        body={this.state.noteInEdit.body}
                        onChangeTitle={newTitle => {
                            this.setState(update(this.state, {noteInEdit: {title: {$set: newTitle}}}));
                        }}
                        onChangeBody={newBody => {
                            this.setState(update(this.state, {noteInEdit: {body: {$set: newBody}}}));
                        }}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}
