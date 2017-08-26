import * as React from 'react';
import KintoneNoteRepositoryConfig from '../KintoneNoteRepositoryConfig';
import KintoneNoteRepository from '../KintoneNoteRepository';
import Note from '../Note';
import NoteSelector from './NoteSelector';
import {getMuiTheme, lightBaseTheme, MuiThemeProvider} from 'material-ui/styles';
import myConfig from '../MyConfig';
import NoteService from '../NoteService';
import NoteEditor from './NoteEditor';

interface Props {
}

interface State {
    notes: Note[];
    noteInEdit: Note;
}

export const AppStyles = {
    textBase: {
        fontFamily: 'Monaco, monospace',
        fontSize: 12,
    }
};

export default class NoteApp extends React.PureComponent<Props, State> {
    constructor() {
        super();
        this.state = {
            notes: [],
            noteInEdit: Note.emptyNote(),
        };

        NoteService.getAll().then(notes => {
            this.setState({notes: notes});
        });
    }

    render() {
        return (
            <MuiThemeProvider muiTheme={getMuiTheme(lightBaseTheme)}>
                <div>
                    <NoteSelector
                        notes={this.state.notes}
                        onSelectNote={note => {
                            this.setState({noteInEdit: note});
                        }}
                    />
                    <NoteEditor
                        note={this.state.noteInEdit}
                    />
                </div>
            </MuiThemeProvider>
        );
    }

}
