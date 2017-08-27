import Note, {NoteId} from './Note';

export default abstract class NoteRepository {

    abstract getAll(): Promise<Note[]>;
    abstract get(id: number): Promise<Note>;
    abstract add(note: Note): Promise<NoteId>;
    abstract update(note: Note): Promise<void>;
    abstract deleteLogically(id: number): Promise<void>;

}