import Note from './Note';
import NoteRepository from './NoteRepository';

const DUMMY_NOTE: Note = new Note(1, 'title', 'body');

const Fields = {
    TITLE: 'title',
    BODY: 'body',
    DELETED: 'deleted',
};

// TODO 1.implement
export default class KintoneNoteRepository implements NoteRepository {

    private cybozuHost: string;
    private appId: number;

    getAll(): Note[] {
        const uri: string = `https://${this.cybozuHost}/k/v1/records.json`
        const data: object = {
            app: this.appId,
            // fields: ['$id', Fields.TITLE, Fields.BODY, Fields.DELETED, "created_time", "dropdown"]
        };
        new Request(uri, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                // API or session? secure-access?
            }
        });
        return [DUMMY_NOTE];
    }

    get(): Note {
        return DUMMY_NOTE;
    }

    add(note: Note): Note {
        return DUMMY_NOTE;
    }

    update(id: number): void {
        return;
    }

    delete(id: number) : void {
        return;
    }
}