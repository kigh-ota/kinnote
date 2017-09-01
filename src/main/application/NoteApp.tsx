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

    private saveNoteToCache(title: string, body: string): void {
        if (this.state.noteIdInEdit !== null) {
            const anyChangesMade = this.noteService.update(this.state.noteIdInEdit, title, body);
            if (anyChangesMade) {
                this.noteSelector.refreshTitleList();
            }
        } else {
            this.noteService.add(title, body).then(id => {
                if (id !== null) {
                    this.noteSelector.refreshTitleList();
                    this.setState({noteIdInEdit: id});
                    this.noteEditor.setState({showSaveNotifier: true});
                }
            });
        }
    }

    private flushNoteCache(): void {
        this.noteService.flush().then(ary => {
            if (ary.length > 0) {
                this.noteEditor.setState({showSaveNotifier: true});
            }
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div>
                    <NoteSelector
                        ref={(node: NoteSelector) => { this.noteSelector = node; }}
                        selectedId={this.state.noteIdInEdit}
                        onSelectNote={id => {
                            this.saveNoteToCache(this.noteEditor.state.title, this.noteEditor.state.body);
                            this.setState({noteIdInEdit: id});
                            this.noteEditor.loadNote(id);
                        }}
                    />
                    <NoteEditor
                        ref={(node: NoteEditor) => { this.noteEditor = node; }}
                        id={this.state.noteIdInEdit}
                        onSaveNote={(title: string, body: string) => {
                            this.saveNoteToCache(title, body);
                            this.flushNoteCache();
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
