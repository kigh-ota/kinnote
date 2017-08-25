import Note from './Note';

export default interface NoteRepository {

    getAll(): Note[];
    get(): Note;
    add(note: Note): Note;
    update(id: number): void;
    delete(id: number): void; // logical deletion

}