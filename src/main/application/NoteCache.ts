import Note from '../domain/model/Note';

type NoteCacheItem = {
    note: Note;
    modified: boolean;
    deleted: boolean;
}

export default class NoteCache {

    private items: NoteCacheItem[];

    constructor() {
        this.items = [];
    }

    public get(id: number): Note {
        return this.getItem(id).note;
    }

    public getAll(): Note[] {
        return this.items.map(item => item.note);
    }

    public add(note: Note): void {
        if (note.getId() === null) {
            throw new Error();
        }
        this.items.push({
            note: note,
            modified: false,
            deleted: false,
        });
    }

    public update(id: number, title: string, body: string): void {
        const item = this.getItem(id);
        if (item.note.getTitle() !== title) {
            item.note.setTitle(title);
            item.modified = true;
        }
        if (item.note.getBody() !== body) {
            item.note.setBody(body);
            item.modified = true;
        }
    }

    public remove(id: number): void {
        this.getItem(id).deleted = true;
    }

    public isModified(id: number): boolean {
        return this.getItem(id).modified;
    }

    public isDeleted(id: number): boolean {
        return this.getItem(id).deleted;
    }

    public resetFlags(id: number): void {
        const item = this.getItem(id);
        item.deleted = false;
        item.modified = false;
    }

    private getItem(id: number): NoteCacheItem {
        const item = this.items.find(item => item.note.getId() === id);
        if (!item) {
            throw new Error();
        }
        return item;
    }
}
