import * as React from 'react';
import {TextField} from 'material-ui';
import {AppStyles} from './NoteApp';
import Body from '../domain/model/Body';
import {FormEvent} from 'react';

interface Props {
    value: string;
    onChange: (newValue: string, newSelectionStart: number, newSelectionEnd: number) => void;
}

interface State {
}

export default class BodyInput extends React.PureComponent<Props, State> {

    private input: TextField;

    private unindent(pos: number): void {
        const ret = StringUtil.decreaseIndent(this.props.value, pos);
        this.props.onChange(ret.updated, pos - ret.numRemove, pos - ret.numRemove);
    }

    private removeBullet(pos: number, line: LineInfo): void {
        const newContent = this.props.value.substring(0, pos - line.bullet.length) + this.props.value.substring(pos);
        this.props.onChange(newContent, pos - line.bullet.length, pos - line.bullet.length);
    }

    private insert(str: string, pos: number): void {
        const newContent: string = this.props.value.substring(0, pos) + str + this.props.value.substring(pos);
        this.props.onChange(newContent, pos + str.length, pos + str.length);
    }

    private handleTabKeyDown(e: KeyboardEvent) {
        const target: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
        e.preventDefault();
        if (target.selectionStart !== target.selectionEnd) {
            // text selected
            const posStart = target.selectionStart;
            const posEnd = target.selectionEnd;
            const ret = StringUtil.increaseIndentRange(this.props.value, posStart, posEnd);
            this.props.onChange(ret.updated, posStart + ret.numAddStart, posEnd + ret.numAddEnd);
        } else {
            // no text selected
            const pos = target.selectionStart;
            const ret = StringUtil.increaseIndent(this.props.value, pos);
            this.props.onChange(ret.updated, pos + ret.numAdd, pos + ret.numAdd);
        }
    }

    private handleShiftTabKeyDown(e: KeyboardEvent): void {
        const target: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
        e.preventDefault();
        if (target.selectionStart !== target.selectionEnd) {
            // text selected
            const posStart = target.selectionStart;
            const posEnd = target.selectionEnd;
            const ret = StringUtil.decreaseIndentRange(this.props.value, posStart, posEnd);
            this.props.onChange(ret.updated, posStart - ret.numRemoveStart, posEnd - ret.numRemoveStart);
        } else {
            // no text selected
            const pos = target.selectionStart;
            this.unindent(pos)
        }
    }

    private handleBackspaceKeyDown(e: KeyboardEvent) {
        const target: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
        if (target.selectionStart === target.selectionEnd) {
            const pos = target.selectionStart;
            const line = StringUtil.getLineInfo(pos, this.props.value);
            if (line.indent > 0 && 0 < line.col && line.col <= line.indent) {
                e.preventDefault();
                this.unindent(pos);
            }
        }
    }

    private handleKeyDown(e: KeyboardEvent): void {
        if (e.key === 'Tab' && e.shiftKey) {
            this.handleShiftTabKeyDown(e);
        } else if (e.key === 'Tab' && !e.shiftKey) {
            this.handleTabKeyDown(e);
        } else if (e.key === 'Backspace') {
            this.handleBackspaceKeyDown(e);
        }
    }

    private handleEnterKeyPress(e: KeyboardEvent) {
        const target: HTMLTextAreaElement = e.target as HTMLTextAreaElement;
        if (target.selectionStart !== target.selectionEnd) {
            return;
        }
        const pos = target.selectionStart;
        const line = StringUtil.getLineInfo(pos, this.props.value);
        debugger;
        if (line.col === line.str.length) { // if the cursor is at the end of line
            if (line.str.length === line.indent && line.indent > 0) {   // indent only and not empty
                e.preventDefault();
                this.unindent(pos);
            } else if (line.bullet && line.str.length === line.indent + line.bullet.length) { // bullet (+ indent) only
                e.preventDefault();
                this.removeBullet(pos, line);
            }
        } else if (line.col >= line.indent + line.bullet.length) {
            // when the cursor is after the indent and bullet (if exists)
            // => continues indent and bullet (if exists)
            e.preventDefault();
            const strInsert: string = '\n' + ' '.repeat(line.indent) + line.bullet;
            this.insert(strInsert, pos);
        } else if (line.bullet && line.col === line.indent) {
            // when the cursor is between indent and bullet
            // => continues only the indent
            e.preventDefault();
            const strInsert: string = '\n' + ' '.repeat(line.indent);
            this.insert(strInsert, pos);
        }
    }

    private handleKeyPress(e: KeyboardEvent): void {
        if (e.key === 'Enter') {
            this.handleEnterKeyPress(e);
        }
    }

    public forceSelectionStates(start: number, end: number): void {
        const input = this.input as any;
        input.input.refs.input.selectionStart = start;
        input.input.refs.input.selectionEnd = end;
    }

    render() {
        const bodyLines: number = new Body(this.props.value).getNumberOfLines();
        const bodyRows: number = Math.max(6, bodyLines);

        return (
            <TextField
                ref={(input: TextField) => { this.input = input; }}
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
                onChange={(e: FormEvent<HTMLTextAreaElement>, newValue: string) => {
                    const newValueRep = newValue.replace('　', '  ');
                    const diffChar = newValueRep.length - newValue.length;
                    const target = e.target as HTMLTextAreaElement;
                    const newSelectionStart = target.selectionStart + diffChar;
                    const newSelectionEnd = target.selectionEnd + diffChar;
                    this.props.onChange(newValueRep, newSelectionStart, newSelectionEnd);
                }}
                onKeyDown={this.handleKeyDown.bind(this)}
                onKeyPress={this.handleKeyPress.bind(this)}
                onKeyUp={(e: any) => {
                    this.props.onChange(this.props.value, e.target.selectionStart, e.target.selectionEnd);
                }}
                onMouseUp={(e: any) => {
                    // @types/material-ui needs to be modified to use this handler!
                    this.props.onChange(this.props.value, e.target.selectionStart, e.target.selectionEnd);
                }}
            />
        );
    }
}

type LineInfo = {
    str: string,
    posBegin: number,
    posEnd: number, // (index of the last character of str) + 1
    col: number,
    num: number,    // 行番号(1-)
    indent: number,
    bullet: Bullet,
};

type Bullet = '' | '* ' | '- ' | '・';

const TAB_SPACES = 2;

function getLineInfo_(pos: number, str: string): LineInfo {
    if (pos > str.length) {
        throw new Error('invalid cursor position');
    }
    let posBegin: number = pos;
    while (posBegin > 0) {
        if (str.charAt(posBegin - 1) === '\n') break;
        posBegin--;
    }
    let posEnd: number = str.indexOf('\n', pos);
    if (posEnd === -1) {
        posEnd = str.length;
    }
    const line: string = str.slice(posBegin, posEnd);
    let indent: number = 0;
    for (; indent < line.length; indent++) {
        if (line.charAt(indent) !== ' ') break;
    }
    // seek bullet
    let bulletFound = '';
    ['* ', '- ', '・'].forEach(bullet => {
        if (line.length >= indent + bullet.length && line.substr(indent, bullet.length) === bullet) bulletFound = bullet;
    });
    return {
        str: line,  // should not include \n
        posBegin: posBegin,
        posEnd: posEnd,
        col: pos - posBegin,
        num: str.substring(0, pos).split('\n').length,
        indent: indent,
        bullet: bulletFound as Bullet,
    };
}

function changeIndentRangeInner_(str: string, posStart: number, posEnd: number, isIncrease: boolean): {updated: string, diffStart: number, diffEnd: number} {
    const lineStart = getLineInfo_(posStart, str);
    const lineEnd = getLineInfo_(posEnd, str);
    let line = getLineInfo_(posStart, str);
    let diffStart = 0;
    let diffEnd = 0;
    while (true) {  // eslint-disable-line no-constant-condition
        let diff: number = 0;
        if (isIncrease) {
            const ret = StringUtil.increaseIndent(str, line.posBegin);
            str = ret.updated;
            diff = ret.numAdd;
        } else {
            const ret = StringUtil.decreaseIndent(str, line.posBegin);
            str = ret.updated;
            diff = ret.numRemove;
        }
        if (line.num === lineStart.num) diffStart += diff;
        diffEnd += diff;
        if (line.num === lineEnd.num) {
            break;
        }
        line = isIncrease   // next line
            ? getLineInfo_(line.posEnd + diff + 1, str)
            : getLineInfo_(line.posEnd - diff + 1, str);
    }
    return {
        updated: str,
        diffStart: diffStart,
        diffEnd: diffEnd,
    };
}

class StringUtil {
    static getLineInfo(pos: number, str: string): LineInfo {
        return getLineInfo_(pos, str);
    }

    static changeIndent(n: number, content: string, line: LineInfo): string {
        if (n > 0) {
            return content.substring(0, line.posBegin) + ' '.repeat(n) + content.substring(line.posBegin);
        } else if (n < 0) {
            n = -n;
            if (n > line.indent) {
                throw new Error();
            }
            return content.substring(0, line.posBegin) + content.substring(line.posBegin + n);
        }
        return content;
    }

    // インデントを一段上げた文字列を返す
    static increaseIndent(content: string, pos: number): {updated: string, numAdd: number} {
        const line = getLineInfo_(pos, content);
        const numAdd: number = TAB_SPACES - (line.indent % TAB_SPACES);
        return {
            updated: StringUtil.changeIndent(numAdd, content, line),
            numAdd: numAdd
        };
    }

    // インデントを一段下げた文字列を返す
    static decreaseIndent(content: string, pos: number): {updated: string, numRemove: number} {
        const line = getLineInfo_(pos, content);
        if (line.indent === 0) {
            return {
                updated: content,
                numRemove: 0,
            };
        }
        const r = line.indent % TAB_SPACES;
        const numRemove = (r === 0) ? TAB_SPACES : r;
        return {
            updated: StringUtil.changeIndent(-numRemove, content, line),
            numRemove: numRemove
        };
    }

    static increaseIndentRange(str: string, posStart: number, posEnd: number): {updated: string, numAddStart: number, numAddEnd: number} {
        const ret = changeIndentRangeInner_(str, posStart, posEnd, true);
        return {
            updated: ret.updated,
            numAddStart: ret.diffStart,
            numAddEnd: ret.diffEnd,
        };
    }

    static decreaseIndentRange(str: string, posStart: number, posEnd: number): {updated: string, numRemoveStart: number, numRemoveEnd: number} {
        const ret = changeIndentRangeInner_(str, posStart, posEnd, false);
        return {
            updated: ret.updated,
            numRemoveStart: ret.diffStart,
            numRemoveEnd: ret.diffEnd,
        };
    }
}