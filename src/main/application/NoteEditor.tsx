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
import NoteService from '../domain/model/NoteService';

interface Props {
    id: number | null;
}

interface State {
    title: string;
    body: string;
}

export default class NoteEditor extends React.PureComponent<Props, State> {

    private noteService: NoteService;

    constructor() {
        super();
        this.noteService = NoteService.getInstance();
        this.state = {
            title: '',
            body: '',
        };
    }

    open(id: number) {
        this.setState({
            title: this.noteService.getTitle(id),
            body: this.noteService.getBody(id),
        });
    }

    private save(): void {
        if (this.props.id !== null) {
            this.noteService.update(this.props.id, this.state.title, this.state.body);
        }
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
                style={{ marginLeft: '250px' }}
                onKeyDown={(e: any) => {
                    // Ctrl+S
                    if ((e.key === 'S' || e.key === 's') && e.ctrlKey) {
                        this.save();
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
                        {note.getId() && <DeleteMenu />}
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
                        value={this.state.body}
                        onChange={newBody => {
                            this.setState({body: newBody});
                        }}
                    />

                    <Divider/>

                    <div style={{width: '100%', display: 'flex'}}>
                        <NewNoteButton/>
                        <NewNoteTodayButton/>
                    </div>
                </Paper>

                <Snackbar
                    open={false}
                    message="Note saved."
                    autoHideDuration={2500}
                />

                <CursorStatus/>
            </div>
        );

        function NewNoteButton(props: any) {
            return (
                <FloatingActionButton
                    style={{margin: '8px'}}
                    onClick={props.onClick}
                    disabled={false}
                >
                    <ContentAdd />
                </FloatingActionButton>
            );
        }

        function NewNoteTodayButton(props: any) {
            return (
                <FloatingActionButton
                    style={{margin: '8px'}}
                    onClick={props.onClick}
                    disabled={false}
                >
                    <ActionToday />
                </FloatingActionButton>
            );
        }

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

        function CursorStatus() {
            return (
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
                        1
                        // `[${this.state.selectionStart}:L${lineStart.num}(${lineStart.indent})${lineStart.bullet},`
                        // + `${this.state.selectionEnd}:L${lineEnd.num}(${lineEnd.indent})${lineEnd.bullet}]`
                        // + `(${bodyLines} lines)`
                    }
                </div>
            );
        }
    }
}