import {Tag} from '../domain/model/Note';
import * as React from 'react';
import {Drawer, IconButton, MenuItem, TextField, IconMenu} from 'material-ui';
import {AppStyles, NoteState, NoteStateId} from './NoteApp';
import {ActionToc, AvSortByAlpha, ContentClear} from 'material-ui/svg-icons';
import {colors} from 'material-ui/styles';
import {default as NoteService, SortType} from '../domain/model/NoteService';

interface Props {
    selectedId: NoteStateId,
    onSelectNote: (id: number) => void;
}

interface State {
    idTitleMap: Map<number, IdTitleMapValue>,
    tags: Tag[],
    filterInputValue: string;
    sortType: SortType;
}

export const NOTE_SELECTOR_WIDTH: number = 300;

export type IdTitleMapValue = {title: string, modified: boolean, deleted: boolean};

export default class NoteSelector extends React.PureComponent<Props, State> {

    private noteService: NoteService;

    constructor() {
        super();
        this.noteService = NoteService.getInstance();
        const INITIAL_SORT_TYPE: SortType = SortType.UPDATE_TIME;
        let tags: Tag[] = [];
        this.noteService.getAllTags().forEach(tag => {
            tags.push(tag);
        });
        tags.sort((a, b) => a.localeCompare(b));
        this.state = {
            idTitleMap: this.noteService.getIdTitleMap(INITIAL_SORT_TYPE),
            tags: tags,
            filterInputValue: '',
            sortType: INITIAL_SORT_TYPE,
        };
    }

    public refreshTitleList() {
        const newIdTitleMap = this.noteService.getIdTitleMap(this.state.sortType, this.state.filterInputValue);
        // console.log('refreshTitleList', newIdTitleMap);
        this.setState({idTitleMap: newIdTitleMap});
    }

    render() {
        const alphaSort: boolean = this.state.sortType === SortType.ALPHABETICAL;
        let listItems: any[] = [];
        this.state.idTitleMap.forEach((title, id) => {
            let primaryText = title.title;
            if (title.modified) {
                // FIXME: asterisk is shown even though after saved
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
                />
            );
        });

        let tagMenuItems: any[] = this.state.tags.map(tag => {
            return <MenuItem
                key={tag}
                primaryText={`#${tag}`}
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
        });

        const buttonSize: number = 24;
        const buttonIconSize: number = 18;
        const buttonMarginRight: number = 6;

        return (
            <Drawer
                width={NOTE_SELECTOR_WIDTH}
                open={true}
                docked={true}
            >
                <div>
                    <TextField
                        name="noteFilterInput"
                        style={Object.assign({}, {
                            margin: '0 8px',
                            width: NOTE_SELECTOR_WIDTH - 16 - buttonSize*3 - buttonMarginRight,
                        }, AppStyles.textBase)}
                        hintText="Filter"
                        value={this.state.filterInputValue}
                        onChange={(e: Object, newValue: string) => {
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
                                idTitleMap: newIdTitleMap
                            });
                        }}
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
                            const newSortType: SortType = alphaSort ? SortType.UPDATE_TIME : SortType.ALPHABETICAL;
                            const newIdTitleMap = this.noteService.getIdTitleMap(newSortType, this.state.filterInputValue);
                            this.setState({
                                sortType: newSortType,
                                idTitleMap: newIdTitleMap
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

                <div className="note-list">
                    {listItems}
                </div>
            </Drawer>
        );

        function TagMenu() {
            return <IconMenu
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
        }
    }
}
