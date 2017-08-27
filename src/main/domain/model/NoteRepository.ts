import Note, {NoteId} from './Note';

export default interface NoteRepository {

    getAll(): Promise<Note[]>;
    get(id: number): Promise<Note>;
    add(note: Note): Promise<NoteId>;
    update(note: Note): Promise<void>;
    deleteLogically(id: number): Promise<void>;

}