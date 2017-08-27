import Note, {Tag} from '../domain/model/Note';
import * as React from 'react';
import {Drawer, IconButton, MenuItem, TextField} from 'material-ui';
import {AppStyles, NoteState} from './NoteApp';
import {AvSortByAlpha, ContentClear} from 'material-ui/svg-icons';
import Body from '../domain/model/Body';
import Timestamp from '../domain/model/Timestamp';
import {colors} from 'material-ui/styles';

interface Props {
    notes: NoteState[],
    onSelectNote: (id: number) => void;
}

enum NoteSortType {
    UPDATE_TIME,
    ALPHABETICAL,
}

interface State {
    filterInputValue: string;
    sortType: NoteSortType;
}

export default class NoteSelector extends React.PureComponent<Props, State> {

    constructor() {
        super();
        this.state = {
            filterInputValue: '',
            sortType: NoteSortType.UPDATE_TIME
        };
    }

    private applyFilter(note: NoteState): boolean {
        if (this.state.filterInputValue === '') {
            return true;    // no filter
        }
        return this.matchTitle(note) || this.matchTags(note);
    }

    // TODO: move to Note class
    private matchTitle(note: NoteState): boolean {
        return note.title.toLocaleLowerCase().indexOf(this.state.filterInputValue.toLocaleLowerCase()) !== -1;
    }

    private matchTags(note: NoteState): boolean {
        const tags: Set<Tag> = new Body(note.body).getTags();
        return Array.from(tags).some(tag => tag.toLocaleLowerCase().indexOf(this.state.filterInputValue.toLocaleLowerCase()) !== -1);
    }

    render() {
        const filteredNotes = this.props.notes.filter(note => this.applyFilter(note));
        const alphaSort: boolean = this.state.sortType === NoteSortType.ALPHABETICAL;
        const sortedNotes = alphaSort
            ? filteredNotes.sort((a, b) => a.title.localeCompare(b.title))
            : filteredNotes.sort((a, b) => - Timestamp.compare(a.updatedAt, b.updatedAt));

        const listItems = sortedNotes.map(note => {
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
                <div>
                    <TextField
                        name="noteFilterInput"
                        style={Object.assign({}, {
                            margin: '0 8px',
                            width: drawerWidth - 16 - buttonSize*2 - buttonMarginRight,
                        }, AppStyles.textBase)}
                        hintText="Filter"
                        value={this.state.filterInputValue}
                        onChange={(e: Object, newValue: string) => {
                            this.setState({filterInputValue: newValue});
                        }}
                    />
                    <IconButton
                        disabled={this.state.filterInputValue === ''}
                        onClick={() => {this.setState({filterInputValue: ''});}}
                        iconStyle={{width: buttonIconSize, height: buttonIconSize}}
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                            padding: (buttonSize - buttonIconSize) / 2,
                            marginRight: 0,
                            verticalAlign: 'middle'
                        }}
                    >
                        <ContentClear />
                    </IconButton>
                    <IconButton
                        onClick={() => {
                            this.setState({sortType: alphaSort ? NoteSortType.UPDATE_TIME : NoteSortType.ALPHABETICAL});
                        }}
                        iconStyle={{
                            width: buttonIconSize,
                            height: buttonIconSize,
                            color: alphaSort ? colors.blue900 : colors.grey500,
                        }}
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                            padding: (buttonSize - buttonIconSize) / 2,
                            marginRight: buttonMarginRight,
                            verticalAlign: 'middle',
                        }}
                    >
                        <AvSortByAlpha />
                    </IconButton>

                </div>

                <div className="note-list">
                    {listItems}
                </div>
            </Drawer>
        );
    }
}
