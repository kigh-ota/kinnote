import * as React from 'react';
import Note from '../domain/model/Note';
import NoteSelector from './NoteSelector';
import {getMuiTheme, lightBaseTheme, MuiThemeProvider} from 'material-ui/styles';
import NoteService from '../domain/model/NoteService';
import NoteEditor from './NoteEditor';
import update = require('immutability-helper');
import Timestamp from '../domain/model/Timestamp';

export const AppStyles = {
    textBase: {
        fontFamily: 'Monaco, monospace',
        fontSize: 12,
    }
};

interface Props {
}

interface State {
    noteIdInEdit: NoteStateId;
}

export type NoteStateId = number | null;

// Use this object type instead of the original Note entity class to make state as simple as possible.
export interface NoteState {
    id: NoteStateId;
    title: string;
    body: string;
    createdAt: Timestamp,
    updatedAt: Timestamp,
}

function toNoteState(note: Note): NoteState {
    return {
        id: note.getId(),
        title: note.getTitle(),
        body: note.getBody(),
        createdAt: note.getCreatedAt(),
        updatedAt: note.getUpdatedAt(),
    };
}

export default class NoteApp extends React.PureComponent<Props, State> {

    private noteService: NoteService;

    private noteSelector: NoteSelector;

    private noteEditor: NoteEditor;

    constructor() {
        super();
        this.noteService = NoteService.getInstance();
        this.state = {
            noteIdInEdit: null,
        };
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div>
                    <NoteSelector
                        ref={(node: NoteSelector) => { this.noteSelector = node; }}
                        selectedId={this.state.noteIdInEdit}
                        onSelectNote={id => {
                            this.noteEditor.save(false);
                            this.setState({noteIdInEdit: id});
                            this.noteEditor.open(id);
                        }}
                    />
                    <NoteEditor
                        ref={(node: NoteEditor) => { this.noteEditor = node; }}
                        id={this.state.noteIdInEdit}
                        onUpdateNote={() => {
                            this.noteSelector.updateList();
                        }}
                        onAddNote={(id: number) => {
                            this.noteSelector.updateList();
                            this.setState({noteIdInEdit: id});
                        }}
                        onDeleteNote={() => {
                            this.noteSelector.updateList();
                            this.setState({noteIdInEdit: null});
                            this.noteEditor.openNewNote();
                        }}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}
