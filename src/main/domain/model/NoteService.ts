import Note, {NoteId, Tag} from './Note';
import KintoneNoteRepository from '../../infrastructure/KintoneNoteRepository';
import myConfig from '../../MyConfig';
import NoteRepository from './NoteRepository';
import NoteCache from './NoteCache';
import {IdTitleMapValue} from '../../application/NoteSelector';

export enum SortType {
    UPDATE_TIME,
    ALPHABETICAL,
}

// TODO: add test
// TODO: DI
// TODO: consider using caching library
export default class NoteService {

    private cache: NoteCache;

    private repository: NoteRepository;

    private constructor() {
        this.cache = new NoteCache();
        this.repository = new KintoneNoteRepository(myConfig);
    }

    public static getInstance(): NoteService {
        if (instance === null) {
            instance = new NoteService();
        }
        return instance;
    }

    public init(): Promise<void> {
        return this.repository.getAll().then(notes => {
            notes.forEach(note => {
                this.cache.add(note);
            });
        });
    }

    public flush(): Promise<any> {
        let promises: Promise<any>[] = [];
        this.cache.getAll().forEach(note => {
            const id = note.getId();
            if (id === null) {
                throw new Error();
            }
            if (this.cache.isDirty(id)) {
                if (this.cache.needsDeletion(id)) {
                    this.log(`delete id=${id}`);
                    promises.push(this.repository.deleteLogically(id).then(() => { this.cache.setClean(id); }));
                }
                else if (this.cache.needsUpdate(id)) {
                    this.log(`update id=${id}`);
                    promises.push(this.repository.update(note).then(() => { this.cache.setClean(id); }));
                }
            }
        });
        return Promise.all(promises);
    }

    public add(title: string, body: string): Promise<number | null> {
        if (title === '') {
            return Promise.resolve(null);
        }
        // flush immediately
        this.log(`add`);
        return this.repository.add(new Note(null, title, body, false, null, null)).then(noteId => {
            if (noteId === null) {
                throw new Error();
            }
            return this.repository.get(noteId);
        }).then(note => {
            this.cache.add(note);
            return note.getId() as number;
        }); // TODO handle error (e.g., when title is duplicated)
    }

    public getIdTitleMap(sortType: SortType, filterValue?: string): Map<number, IdTitleMapValue> {
        const map: Map<number, IdTitleMapValue> = new Map();
        this.cache.getAllNotDeleted()
            .filter(note => note.matchWord(filterValue || ''))
            .sort((a, b) => Note.compare(a, b, sortType))
            .forEach(note => {
                const id = note.getId() as number;
                map.set(id, {
                    title: note.getTitle(),
                    modified: this.cache.needsUpdate(id),
                    deleted: this.cache.needsDeletion(id),
                });
            });
        return map;
    }

    public getAllTagCounts(): Map<Tag, number> {
        const tagCounts: Map<Tag, number> = new Map();
        this.cache.getAllNotDeleted().forEach(note => {
            note.getTags().forEach(tag => {
                if (!tagCounts.has(tag)) {
                    tagCounts.set(tag, 0);
                }
                tagCounts.set(tag, (tagCounts.get(tag) as number) + 1);
            });
        });
        return tagCounts;
    }

    public getTitle(id: number): string {
        return this.cache.get(id).getTitle();
    }

    public getBody(id: number): string {
        return this.cache.get(id).getBody();
    }

    public update(id: number, title: string, body: string): boolean {
        return this.cache.update(id, title, body);
    }

    public remove(id: number): void {
        this.cache.remove(id);
    }

    private log(...optionalParams: any[]) {
        console.log.apply(this, [this.constructor.name].concat(optionalParams));
    }
}

let instance: NoteService | null = null;
