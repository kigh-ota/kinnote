// Note Entity


import Body from './Body';
import Timestamp, {TimestampValue} from './Timestamp';
import {SortType} from './NoteService';

export default class Note {
    private id: NoteId;
    private title: Title;
    private body: Body;
    private createdAt: Timestamp;
    private updatedAt: Timestamp;
    private deleted: boolean;

    constructor(id: NoteId, title: Title, body: string, deleted: boolean, createdAt: TimestampValue, updatedAt: TimestampValue) {
        this.id = id;
        this.setTitle(title);
        this.setBody(body);
        this.createdAt = new Timestamp(createdAt);
        this.updatedAt = new Timestamp(updatedAt);
        this.deleted = deleted;
    }

    getId(): NoteId {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    setTitle(title: string): void {
        this.title = title;
    }

    getBody(): string {
        return this.body.getValue();
    }

    setBody(body: string): void {
        this.body = new Body(body);
    }

    getCreatedAt(): Timestamp {
        return this.createdAt;
    }

    getUpdatedAt(): Timestamp {
        return this.updatedAt;
    }

    isDeleted(): boolean {
        return this.deleted;
    }

    setDeleted(deleted: boolean): void {
        this.deleted = deleted;
    }

    getTags(): Set<Tag> {
        return this.body.getTags();
    }

    matchWord(word: string): boolean {
        if (word === '') {
            return true;    // no filter
        }
        return this.titleMatchWord(word) || this.tagsMatchWord(word);
    }

    private titleMatchWord(word: string): boolean {
        return this.getTitle().toLocaleLowerCase().indexOf(word.toLocaleLowerCase()) !== -1;
    }

    private tagsMatchWord(word: string): boolean {
        return Array.from(this.getTags()).some(tag => tag.toLocaleLowerCase().indexOf(word.toLocaleLowerCase()) !== -1);
    }

    static compare(a: Note, b: Note, sortType: SortType): number {
        if (sortType === SortType.ALPHABETICAL) {
            return a.title.localeCompare(b.title);
        }
        else if (sortType === SortType.UPDATE_TIME) {
            return Timestamp.compare(a.updatedAt, b.updatedAt);
        }
        else {
            throw new Error();
        }
    }
}

export type NoteId = number | null;
type Title = string;
export type Tag = string;
