import * as React from 'react';
import Note from '../domain/model/Note';
import {
    Chip, Divider, FloatingActionButton, IconButton, IconMenu, MenuItem, Paper, Snackbar
} from 'material-ui';
import {grey500, white, yellow100} from 'material-ui/styles/colors';
import {AppStyles} from './NoteApp';
import {ContentAdd, ActionToday, NavigationMoreVert} from 'material-ui/svg-icons';
import TitleInput from './TitleInput';
import BodyInput from './BodyInput';

interface Props {
    id: number | null;
    marginLeft: number;
    onDeleteNote: () => void;
    onCreateNewNote: () => void;
    onSaveNote: (title: string, body: string) => void;
    onChangeNote: (newTitle: string, newBody: string, newSelectionStart: number, newSelectionEnd: number) => void;
    refreshNoteSelectorTitleList: () => void;
}

interface State {
    title: string;
    body: string;
    selectionStart: number,
    selectionEnd: number,
    showSaveNotifier: boolean,
}

export default class NoteEditor extends React.PureComponent<Props, State> {

    private bodyInput: BodyInput;

    constructor() {
        super();
        this.state = {
            title: '',
            body: '',
            selectionStart: 0,
            selectionEnd: 0,
            showSaveNotifier: false,
        };
    }

    public setTitleAndBody(title: string, body: string) {
        this.setState({
            title: title,
            body: body
        });
    }

    public forceBodyInputSelectionStates(selectionStart: number, selectionEnd: number): void {
        this.bodyInput.forceSelectionStates(selectionStart, selectionEnd);
    }

    render() {
        const note = new Note(this.props.id, this.state.title, this.state.body, false, null, null);

        const tagChips = Array.from(note.getTags()).map(tag => {
            return (
                <Chip
                    key={tag}
                    style={{margin: 4}}
                    labelStyle={{fontFamily: 'Monaco', fontSize: '11px'}}
                >
                    {tag}
                </Chip>
            );
        });

        return (
            <div
                className="note-editor"
                style={{ marginLeft: this.props.marginLeft }}
                onKeyDown={(e: any) => {
                    // Ctrl+S
                    if ((e.key === 'S' || e.key === 's') && e.ctrlKey) {
                        this.props.onSaveNote(this.state.title, this.state.body);
                    }
                    // Ctrl+N
                    if ((e.key === 'N' || e.key === 'n') && e.ctrlKey) {
                        this.props.onCreateNewNote();
                    }
                }}
            >
                <Paper
                    zDepth={1}
                    rounded={false}
                    style={{margin: '8px'}}
                >
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        backgroundColor: note.getId() ? white : yellow100,
                    }}>
                        <TitleInput
                            value={this.state.title}
                            onChange={newTitle => {
                                this.setState({title: newTitle});
                            }}
                        />
                        {note.getId() && <DeleteMenu onClick={this.props.onDeleteNote} />}
                    </div>

                    <Divider/>

                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        minHeight: 10,
                    }}>
                        {tagChips}
                    </div>

                    <Divider/>

                    <BodyInput
                        ref={(input: BodyInput) => { this.bodyInput = input; }}
                        value={this.state.body}
                        onChange={(newValue: string, newSelectionStart: number, newSelectionEnd: number) => {
                            this.props.onChangeNote(this.state.title, newValue, newSelectionStart, newSelectionEnd);
                        }}
                    />
                </Paper>

                <Snackbar
                    open={this.state.showSaveNotifier}
                    message="Note(s) saved."
                    autoHideDuration={2500}
                    onRequestClose={() => {this.setState({showSaveNotifier: false});}}
                />

                <div style={Object.assign({}, AppStyles.textBase, {
                    width: '100%',
                    height: 20,
                    position: 'fixed',
                    right: 5,
                    bottom: 5,
                    textAlign: 'right',
                    fontSize: '10px',
                    color: grey500,
                })}>
                    {
                        `${this.state.selectionStart}:${this.state.selectionEnd}`
                        // `[${this.state.selectionStart}:L${lineStart.num}(${lineStart.indent})${lineStart.bullet},`
                        // + `${this.state.selectionEnd}:L${lineEnd.num}(${lineEnd.indent})${lineEnd.bullet}]`
                        // + `(${bodyLines} lines)`
                    }
                </div>
            </div>
        );

        function DeleteMenu(props: any) {
            return (
                <IconMenu
                    iconButtonElement={<IconButton><NavigationMoreVert/></IconButton>}
                    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    targetOrigin={{horizontal: 'right', vertical: 'top'}}
                    style={{
                        marginLeft: 'auto',
                        marginRight: '8px',
                        marginTop: '8px',
                        marginBottom: '8px',
                    }}
                >
                    <MenuItem
                        primaryText="Delete"
                        onClick={props.onClick}
                    />
                </IconMenu>
            );
        }
    }
}