import * as React from 'react';
import Note from '../domain/model/Note';
import NoteSelector from './NoteSelector';
import {getMuiTheme, lightBaseTheme, MuiThemeProvider} from 'material-ui/styles';
import NoteService from '../domain/model/NoteService';
import NoteEditor from './NoteEditor';
import update = require('immutability-helper');
import Timestamp from '../domain/model/Timestamp';
import FloatingToolBar from './FloatingToolBar';

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

    private createNewNote(): void {
        this.noteSelector.refreshTitleList();
        this.setState({noteIdInEdit: null});
        this.noteEditor.clear();
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
                            this.noteEditor.loadNote(id);
                        }}
                    />
                    <NoteEditor
                        ref={(node: NoteEditor) => { this.noteEditor = node; }}
                        id={this.state.noteIdInEdit}
                        onUpdateNote={() => {
                            this.noteSelector.refreshTitleList();
                        }}
                        onAddNote={(id: number) => {
                            this.noteSelector.refreshTitleList();
                            this.setState({noteIdInEdit: id});
                        }}
                        onDeleteNote={this.createNewNote.bind(this)}
                        onCreateNewNote={this.createNewNote.bind(this)}
                        refreshNoteSelectorTitleList={() => {
                            this.noteSelector.refreshTitleList();
                        }}
                    />
                    <FloatingToolBar
                        onClickNewNoteButton={this.createNewNote.bind(this)}
                    />
                </div>
            </MuiThemeProvider>
        );
    }
}
