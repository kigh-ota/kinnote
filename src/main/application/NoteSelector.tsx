import {Drawer, IconButton, IconMenu, MenuItem, TextField} from 'material-ui';
import {colors} from 'material-ui/styles';
import {ActionToc, AvSortByAlpha, ContentClear} from 'material-ui/svg-icons';
import * as React from 'react';
import {Tag} from '../domain/model/Note';
import {default as NoteService, SortType} from '../domain/model/NoteService';
import {AppStyles, NoteState, NoteStateId} from './NoteApp';

interface Props {
    selectedId: NoteStateId;
    width: number;
    onSelectNote: (id: number) => void;
}

interface State {
    idTitleMap: Map<number, IdTitleMapValue>;
    tagCounts: Map<Tag, number>;
    filterInputValue: string;
    sortType: SortType;
}

export interface IdTitleMapValue {
    title: string;
    modified: boolean;
    deleted: boolean;
}

export default class NoteSelector extends React.PureComponent<Props, State> {

    private filterInput: TextField;

    private noteService: NoteService;

    constructor() {
        super();
        this.noteService = NoteService.getInstance();
        const INITIAL_SORT_TYPE: SortType = SortType.UPDATE_TIME;
        this.state = {
            idTitleMap: this.noteService.getIdTitleMap(INITIAL_SORT_TYPE),
            filterInputValue: '',
            tagCounts: this.noteService.getAllTagCounts(),
            sortType: INITIAL_SORT_TYPE,
        };
    }

    public refreshTitleList() {
        const newIdTitleMap = this.noteService.getIdTitleMap(this.state.sortType, this.state.filterInputValue);
        // console.log('refreshTitleList', newIdTitleMap);
        this.setState({idTitleMap: newIdTitleMap});
    }

    public focusFilterInput(): void {
        this.filterInput.focus();
    }

    public render() {
        const alphaSort: boolean = this.state.sortType === SortType.ALPHABETICAL;
        const listItems: any[] = [];
        this.state.idTitleMap.forEach((title, id) => {
            let primaryText = title.title;
            if (title.modified) {
                primaryText = ' * ' + primaryText;
            }
            listItems.push(
                <MenuItem
                    key={id}
                    className="note-list-item"
                    style={{
                        minHeight: (AppStyles.textBase.fontSize + 8) + 'px',
                        lineHeight: (AppStyles.textBase.fontSize + 8) + 'px',
                        backgroundColor: id === this.props.selectedId ? colors.blue200 : colors.white,
                    }}
                    innerDivStyle={AppStyles.textBase}
                    primaryText={primaryText}
                    onClick={this.props.onSelectNote.bind(this, id)}
                    title={`${id}: ${title.title}`}
                    tabIndex={-1}
                />,
            );
        });

        const tagMenuItems: any[] = [];
        this.state.tagCounts.forEach((count, tag) => {
            tagMenuItems.push((
                <MenuItem
                    key={tag}
                    primaryText={`#${tag}`}
                    secondaryText={count}
                    onClick={() => {
                        this.setState({
                            filterInputValue: tag,
                            idTitleMap: this.noteService.getIdTitleMap(this.state.sortType, tag),
                        });
                    }}
                    className="tag-menu-item"
                    style={{
                        minHeight: (AppStyles.textBase.fontSize + 8) + 'px',
                        lineHeight: (AppStyles.textBase.fontSize + 8) + 'px',
                    }}
                    innerDivStyle={AppStyles.textBase}
                />
            ));
        });
        tagMenuItems.sort((a, b) => a.key.localeCompare(b.key));

        const buttonSize: number = 24;
        const buttonIconSize: number = 18;
        const buttonMarginRight: number = 6;

        return (
            <Drawer
                width={this.props.width}
                open={true}
                docked={true}
            >
                <div>
                    <TextField
                        name="noteFilterInput"
                        ref={(input: TextField) => { this.filterInput = input; }}
                        style={Object.assign({}, {
                            margin: '0 8px',
                            width: this.props.width - 16 - buttonSize * 3 - buttonMarginRight,
                        }, AppStyles.textBase)}
                        hintText="Filter"
                        value={this.state.filterInputValue}
                        onChange={(e: any, newValue: string) => {
                            const newIdTitleMap = this.noteService.getIdTitleMap(this.state.sortType, newValue);
                            this.setState({
                                filterInputValue: newValue,
                                idTitleMap: newIdTitleMap,
                            });
                        }}
                    />

                    <IconButton
                        disabled={this.state.filterInputValue === ''}
                        onClick={() => {
                            const newIdTitleMap = this.noteService.getIdTitleMap(this.state.sortType, '');
                            this.setState({
                                filterInputValue: '',
                                idTitleMap: newIdTitleMap,
                            });
                        }}
                        iconStyle={{width: buttonIconSize, height: buttonIconSize}}
                        style={{
                            width: buttonSize,
                            height: buttonSize,
                            padding: (buttonSize - buttonIconSize) / 2,
                            marginRight: 0,
                            verticalAlign: 'middle',
                        }}
                    >
                        <ContentClear />
                    </IconButton>

                    <IconButton
                        onClick={() => {
                            const newSortType: SortType = alphaSort ? SortType.UPDATE_TIME : SortType.ALPHABETICAL;
                            const newIdTitleMap = this.noteService.getIdTitleMap(newSortType, this.state.filterInputValue);
                            this.setState({
                                sortType: newSortType,
                                idTitleMap: newIdTitleMap,
                            });
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
                            marginRight: 0,
                            verticalAlign: 'middle',
                        }}
                    >
                        <AvSortByAlpha />
                    </IconButton>
                    <TagMenu/>
                </div>

                <div className="note-list" tabIndex={0}>
                    {listItems}
                </div>
            </Drawer>
        );

        function TagMenu() {
            return (
                <IconMenu
                    iconButtonElement={
                        <IconButton
                            iconStyle={{
                                width: buttonIconSize,
                                height: buttonIconSize,
                                // color: alphaSort ? colors.blue900 : colors.grey500,
                            }}
                            style={{
                                width: buttonSize,
                                height: buttonSize,
                                padding: (buttonSize - buttonIconSize) / 2,
                                marginRight: buttonMarginRight,
                                verticalAlign: 'middle',
                            }}
                        >
                            <ActionToc/>
                        </IconButton>
                    }
                >
                    {tagMenuItems}
                </IconMenu>
            );
        }
    }
}
