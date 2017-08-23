import Note from './Note';

export default interface NoteRepository {

    getAll(): Array<Note>;

}