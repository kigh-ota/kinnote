import Note from './Note';

export default class NoteRepository {

    constructor() {
    }

    getAll(): Array<Note> {
        return [
            new Note('TITLE', 'BODY'),
            new Note('2', 'BODY2'),
        ];
    }
}