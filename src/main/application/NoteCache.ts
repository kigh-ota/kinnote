import Note from '../domain/model/Note';

type NoteCacheItem = {
    note: Note;
    needsUpdate: boolean;
    needsDeletion: boolean;
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
        return this.items
            .map(item => item.note);
    }

    public getAllNotDeleted(): Note[] {
        return this.items
            .filter(item => !item.note.isDeleted())
            .map(item => item.note);
    }

    public add(note: Note): void {
        if (note.getId() === null) {
            throw new Error();
        }
        this.items.push({
            note: note,
            needsUpdate: false,
            needsDeletion: false,
        });
    }

    // returns if any changes are made
    public update(id: number, title: string, body: string): boolean {
        let ret: boolean = false;
        const item = this.getItem(id);
        if (item.note.getTitle() !== title) {
            item.note.setTitle(title);
            item.needsUpdate = true;
            ret = true;
        }
        if (item.note.getBody() !== body) {
            item.note.setBody(body);
            item.needsUpdate = true;
            ret = true;
        }
        return ret;
    }

    public remove(id: number): void {
        const item = this.getItem(id);
        if (item.note.isDeleted()) {
            throw new Error();
        }
        item.note.setDeleted(true);
        item.needsDeletion = true;
    }

    public isDirty(id: number): boolean {
        const item = this.getItem(id);
        return item.needsUpdate || item.needsDeletion;
    }

    public needsUpdate(id: number): boolean {
        return this.getItem(id).needsUpdate && !this.getItem(id).needsDeletion;
    }

    public needsDeletion(id: number): boolean {
        return this.getItem(id).needsDeletion;
    }

    public setClean(id: number): void {
        const item = this.getItem(id);
        item.needsUpdate = false;
        item.needsDeletion = false;
    }

    private getItem(id: number): NoteCacheItem {
        const item = this.items.find(item => item.note.getId() === id);
        if (!item) {
            throw new Error(`id = ${id} does not exist in cache`);
        }
        return item;
    }
}
