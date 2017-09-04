import Note, {NoteId} from './Note';

export default abstract class NoteRepository {

    public abstract getAll(): Promise<Note[]>;
    public abstract get(id: number): Promise<Note>;
    public abstract add(note: Note): Promise<NoteId>;
    public abstract update(note: Note): Promise<void>;
    public abstract deleteLogically(id: number): Promise<void>;

}