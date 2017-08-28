import Note, {NoteId} from './Note';
import KintoneNoteRepository from '../../infrastructure/KintoneNoteRepository';
import myConfig from '../../MyConfig';
import NoteRepository from './NoteRepository';
import NoteCache from '../../application/NoteCache';

export enum SortType {
    UPDATE_TIME,
    ALPHABETICAL,
}

// TODO: add test
// TODO: DI
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
            if (this.cache.isDeleted(id)) {
                this.log(`delete id=${id}`);
                this.cache.resetFlags(id);
                promises.push(this.repository.deleteLogically(id));
            }
            else if (this.cache.isModified(id)) {
                this.log(`update id=${id}`);
                this.cache.resetFlags(id);
                promises.push(
                    this.repository.update(note).then(() => {
                        this.repository.get(id).then(note => {

                        })
                }));
            }
            else {
                // this.log(`no change for id=${id}`);
            }
        });
        return Promise.all(promises);
    }

    public add(title: string, body: string): Promise<number | null> {
        if (title === '') {
            return Promise.resolve(null);
        }
        // flush immediately
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

    public getIdTitleMap(sortType: SortType, filterValue?: string): Map<number, string> {
        const map: Map<number, string> = new Map();
        this.cache.getAllNotDeleted()
            .filter(note => note.matchWord(filterValue || ''))
            .sort((a, b) => Note.compare(a, b, sortType))
            .forEach(note => {
                map.set(note.getId() as number, note.getTitle());
            });
        return map;
    }

    public getTitle(id: number): string {
        return this.cache.get(id).getTitle();
    }

    public getBody(id: number): string {
        return this.cache.get(id).getBody();
    }

    public update(id: number, title: string, body: string): void {
        this.cache.update(id, title, body);
    }

    public remove(id: number): void {
        this.cache.remove(id);
    }

    private log(...optionalParams: any[]) {
        console.log.apply(this, [this.constructor.name].concat(optionalParams));
    }
}

let instance: NoteService | null = null;
