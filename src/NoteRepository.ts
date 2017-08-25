import Note from './Note';

export default interface NoteRepository {

    getAll(): Promise<Note[]>;
    get(id: number): Promise<Note>;
    add(note: Note): Note;
    update(note: Note): void;
    delete(id: number): void; // logical deletion

}