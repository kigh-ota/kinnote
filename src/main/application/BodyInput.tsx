import * as React from 'react';
import {TextField} from 'material-ui';
import {AppStyles} from './NoteApp';
import Body from '../domain/model/Body';

interface Props {
    value: string;
    onChange: (body: string) => void;
}

interface State {
}

export default class BodyInput extends React.PureComponent<Props, State> {
    render() {
        const bodyLines: number = new Body(this.props.value).getNumberOfLines();
        const bodyRows: number = Math.max(6, bodyLines);

        return (
            <TextField
                name="bodyInput"
                className="note-body-input"
                style={Object.assign({}, {
                    margin: '8px',
                    lineHeight: '1.4em',
                }, AppStyles.textBase)}
                hintText="Body"
                underlineShow={false}
                multiLine={true}
                rows={bodyRows}
                rowsMax={bodyRows}
                fullWidth={true}
                value={this.props.value}
                onChange={(e: Object, newValue: string) => {
                    this.props.onChange(newValue)
                }}
            />
        );
    }
}