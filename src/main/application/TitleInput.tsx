import {TextField} from 'material-ui';
import {AppStyles} from './NoteApp';
import * as React from 'react';

interface Props {
    value: string;
    onChange: (title: string) => void;
}

interface State {
}

export default class TitleInput extends React.PureComponent<Props, State> {
    render() {
        return (
            <TextField
                name="titleInput"
                className="note-title-input"
                style={Object.assign(
                    {},
                    {margin: '8px'},
                    AppStyles.textBase
                )}
                hintText="Title"
                underlineShow={false}
                fullWidth={true}
                value={this.props.value}
                onChange={(e: Object, newValue: string) => {
                    this.props.onChange(newValue)
                }}
            />
        );
    }
}
