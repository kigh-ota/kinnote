import Note from './Note';
import NoteRepository from './NoteRepository';
import KintoneNoteRepositoryConfig from './KintoneNoteRepositoryConfig';

const DUMMY_NOTE: Note = new Note(1, 'title', 'body');

const Fields = {
    TITLE: 'title',
    BODY: 'body',
    DELETED: 'deleted',
};

// TODO 1.implement
export default class KintoneNoteRepository implements NoteRepository {

    private config: KintoneNoteRepositoryConfig;

    constructor(config: KintoneNoteRepositoryConfig) {
        this.config = config;
    }

    getAll(): Note[] {
        const uri: string = `https://${this.config.cybozuHost}/k/v1/records.json`;
        const body: object = {
            app: this.config.appId,
            totalCount: true,
            // fields: ['$id', Fields.TITLE, Fields.BODY, Fields.DELETED, "created_time", "dropdown"]
        };
        const headers = new Headers();
        headers.append('Host', this.config.cybozuHost + ':443');
        headers.append('Content-Type', 'application/json');
        headers.append('X-Cybozu-Authorization', this.config.xCybozuAuthorization);
        headers.append('X-HTTP-Method-Override', 'GET');
        // API or session? secure-access?
        const fetchData: RequestInit = {
            method: 'POST',
            body: JSON.stringify(body),
            headers: headers,
        };
        fetch(uri, fetchData)
            .then(r => r.json())
            .then(json => console.log(json))
            .catch(r => console.log(r));

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