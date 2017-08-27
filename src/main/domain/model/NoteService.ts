import Note, {NoteId} from './Note';
import KintoneNoteRepository from '../../infrastructure/KintoneNoteRepository';
import myConfig from '../../MyConfig';
import NoteRepository from './NoteRepository';

export enum SortType {
    UPDATE_TIME,
    ALPHABETICAL,
}

// TODO: add test
// TODO: DI
export default class NoteService {

    private cache: Note[];

    private repository: NoteRepository;

    private constructor() {
        this.cache = [];
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
            this.cache = notes;
            return;
        });
    }

    public getIdTitleMap(sortType: SortType, filterValue?: string): Map<number, string> {
        const map: Map<number, string> = new Map();
        this.cache
            .filter(note => note.matchWord(filterValue || ''))
            .sort(Note.compareFunction(sortType))
            .forEach(note => {
                map.set(note.getId() as number, note.getTitle());
            });
        return map;
    }

    public getTitle(id: number): string {
        const note = this.cache.find(note => note.getId() === id);
        if (!note) {
            throw new Error();
        }
        return note.getTitle();
    }

    public getBody(id: number): string {
        const note = this.cache.find(note => note.getId() === id);
        if (!note) {
            throw new Error();
        }
        return note.getBody();
    }
}

let instance: NoteService | null = null;
