import {TextField} from 'material-ui';
import * as React from 'react';
import {AppStyles} from './NoteApp';

interface Props {
    value: string;
    onChange: (title: string) => void;
}

interface State {
}

export default class TitleInput extends React.PureComponent<Props, State> {

    private input: TextField;

    public focus(): void {
        this.input.focus();
    }

    public render() {
        return (
            <TextField
                ref={(input: TextField) => { this.input = input; }}
                name="titleInput"
                className="note-title-input"
                style={Object.assign(
                    {},
                    {margin: '8px'},
                    AppStyles.textBase,
                )}
                hintText="Title"
                underlineShow={false}
                fullWidth={true}
                value={this.props.value}
                onChange={(e: any, newValue: string) => {
                    this.props.onChange(newValue);
                }}
            />
        );
    }
}
