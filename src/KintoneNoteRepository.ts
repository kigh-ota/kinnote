import Note from './Note';
import {NoteRepository} from './NoteRepository';

export default class KintoneNoteRepository implements NoteRepository {

    getAll(): Array<Note> {
        return [new Note('title', 'body')];
    }

}