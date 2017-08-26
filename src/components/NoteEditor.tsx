import * as React from 'react';
import Note from '../Note';
import {
    Chip, Divider, FloatingActionButton, IconButton, IconMenu, MenuItem, Paper, Snackbar,
    TextField
} from 'material-ui';
import {grey500, white, yellow100} from 'material-ui/styles/colors';
import {AppStyles} from './NoteApp';
import {ContentAdd, ActionToday, NavigationMoreVert} from 'material-ui/svg-icons';
import TitleInput from './TitleInput';
import BodyInput from './BodyInput';

interface Props {
    id: number | null;
    title: string;
    body: string;
    onChangeTitle: (title: string) => void;
    onChangeBody: (body: string) => void;
}

interface State {
}

export default class NoteEditor extends React.PureComponent<Props, State> {

    render() {
        const note = new Note(this.props.id, this.props.title, this.props.body, false);

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
                className="note-editor" style={{ marginLeft: '250px' }}
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
                            value={this.props.title}
                            onChange={this.props.onChangeTitle}
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
                        value={this.props.body}
                        onChange={this.props.onChangeBody}
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
                    onRequestClose={() => {this.setState({autoSaveNotify: false});}}
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