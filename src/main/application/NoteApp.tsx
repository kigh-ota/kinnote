import update = require('immutability-helper');
import {getMuiTheme, lightBaseTheme, MuiThemeProvider} from 'material-ui/styles';
import * as React from 'react';
import Note from '../domain/model/Note';
import NoteService from '../domain/model/NoteService';
import Timestamp from '../domain/model/Timestamp';
import FloatingToolBar from './FloatingToolBar';
import NoteEditor from './NoteEditor';
import NoteSelector from './NoteSelector';

export const AppStyles = {
    textBase: {
        fontFamily: 'Monaco, monospace',
        fontSize: 12,
    },
};

interface Props {}

interface State {
    noteIdInEdit: NoteStateId;
}

export type NoteStateId = number | null;

// Use this object type instead of the original Note entity class to make state as simple as possible.
export interface NoteState {
    id: NoteStateId;
    title: string;
    body: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
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
        this.noteEditor.setTitleAndBody('', '');
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

    public render() {
        const noteSelectWidth = 300;

        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div
                    onKeyDown={(e: any) => {
                        if ((e.key === 'S' || e.key === 's') && e.ctrlKey) {
                            // Ctrl+S
                            this.noteEditor.saveNote();
                        } else if ((e.key === 'N' || e.key === 'n') && e.ctrlKey) {
                            // Ctrl+N
                            this.noteEditor.createNewNote();
                        } else if (e.key === '/' && e.ctrlKey) {
                            // Ctrl+/
                            this.noteSelector.focusFilterInput();
                        }
                    }}
                >
                    <NoteSelector
                        ref={(node: NoteSelector) => { this.noteSelector = node; }}
                        selectedId={this.state.noteIdInEdit}
                        width={noteSelectWidth}
                        onSelectNote={id => {
                            this.saveNoteToCache(this.noteEditor.state.title, this.noteEditor.state.body);
                            this.setState({noteIdInEdit: id});
                            this.noteEditor.setTitleAndBody(
                                this.noteService.getTitle(id),
                                this.noteService.getBody(id),
                            );
                        }}
                    />
                    <NoteEditor
                        ref={(node: NoteEditor) => { this.noteEditor = node; }}
                        id={this.state.noteIdInEdit}
                        marginLeft={noteSelectWidth}
                        onChangeNote={(title: string, body: string, selectionStart: number, selectionEnd: number) => {
                            if (this.state.noteIdInEdit !== null) {
                                this.noteService.update(this.state.noteIdInEdit, title, body);
                                this.noteSelector.refreshTitleList();   // to put a mark on the modified note
                            }

                            // Cursor position needs to be manually updated,
                            // because it is automatically changed after setState().
                            this.noteEditor.setState(
                                {title, body, selectionStart, selectionEnd},
                                this.noteEditor.forceBodyInputSelectionStates.bind(this.noteEditor, selectionStart, selectionEnd)
                            );
                            return;
                        }}
                        onSaveNote={(title: string, body: string) => {
                            this.saveNoteToCache(title, body);
                            this.flushNoteCache();
                        }}
                        onDeleteNote={() => {
                            if (this.state.noteIdInEdit === null) {
                                throw new Error();
                            }
                            this.noteService.remove(this.state.noteIdInEdit);
                            this.createNewNote();
                        }}
                        onCreateNewNote={(title, body) => {
                            this.saveNoteToCache(title, body);
                            this.createNewNote();
                        }}
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
