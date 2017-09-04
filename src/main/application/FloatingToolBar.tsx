import {FloatingActionButton, Paper} from 'material-ui';
import {ActionToday, ContentAdd} from 'material-ui/svg-icons';
import * as React from 'react';

interface Props {
    onClickNewNoteButton: () => void;
}
interface State {}

export default class FloatingToolBar extends React.PureComponent<Props, State> {
    public render() {
        const style: React.CSSProperties = {
            position: 'fixed',
            right: 10,
            bottom: 10,
            width: 50,
            height: 50,
        };
        return (
            <Paper style={style}>
                <div
                    style={{
                        width: 40,
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        margin: 'auto',
                        paddingLeft: 5,
                        paddingRight: 5,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <NewNoteButton onClick={this.props.onClickNewNoteButton}/>
                </div>
            </Paper>
        );

        function NewNoteButton(props: any) {
            return (
                <FloatingActionButton
                    mini={true}
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
                    mini={true}
                    onClick={props.onClick}
                    disabled={false}
                >
                    <ActionToday />
                </FloatingActionButton>
            );
        }
    }


}