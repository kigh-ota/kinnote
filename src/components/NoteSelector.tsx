import Note from '../Note';
import * as React from 'react';
import {Drawer, MenuItem, TextField} from 'material-ui';
import {AppStyles, NoteState} from './NoteApp';

interface Props {
    notes: NoteState[],
    onSelectNote: (id: number) => void;
}

interface State {
}

export default class NoteSelector extends React.PureComponent<Props, State> {

    constructor() {
        super();
        this.state = {};
    }

    render() {
        // console.log(this.state.notes);
        const listItems = this.props.notes.map(note => {
            return (
                <MenuItem
                    key={`${note.id}`}
                    className="note-list-item"
                    style={{
                        minHeight: (AppStyles.textBase.fontSize + 8) + 'px',
                        lineHeight: (AppStyles.textBase.fontSize + 8) + 'px',
                    }}
                    innerDivStyle={AppStyles.textBase}
                    primaryText={note.title}
                    onClick={this.props.onSelectNote.bind(this, note.id)}
                />
            );
        });

        const drawerWidth: number = 250;
        const buttonSize: number = 24;
        const buttonIconSize: number = 18;
        const buttonMarginRight: number = 6;

        return (
            <Drawer
                width={drawerWidth}
                open={true}
                docked={true}
            >
                <div className="note-list">
                    {listItems}
                </div>
            </Drawer>
        );
    }
}
