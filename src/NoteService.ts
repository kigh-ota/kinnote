import Note from './Note';
import KintoneNoteRepository from './KintoneNoteRepository';
import myConfig from './MyConfig';

// TODO: add test
// TODO: DI
export default class NoteService {

    public static getAll(): Promise<Note[]> {
        const noteRepository = new KintoneNoteRepository(myConfig);
        return noteRepository.getAll();
    }

}
