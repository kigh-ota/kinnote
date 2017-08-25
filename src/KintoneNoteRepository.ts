import Note from './Note';
import NoteRepository from './NoteRepository';
import KintoneNoteRepositoryConfig from './KintoneNoteRepositoryConfig';

const DUMMY_NOTE: Note = new Note(1, 'title', 'body', false);

// TODO 1.implement
export default class KintoneNoteRepository implements NoteRepository {

    private config: KintoneNoteRepositoryConfig;

    constructor(config: KintoneNoteRepositoryConfig) {
        this.config = config;
    }

    // FIXME: should exclude deleted notes
    getAll(): Promise<Note[]> {
        const data: object = {
            app: this.config.appId,
            totalCount: true,
            // fields: ['$id', Fields.TITLE, Fields.BODY, Fields.DELETED, "created_time", "dropdown"]
        };
        return this.jsonRequest('/k/v1/records', 'GET', data)
            .then(json => json.records.map((r: any) => Note.fromJson(r)))
    }

    get(id: number):Promise<Note> {
        const data: object = {
            app: this.config.appId,
            id: id,
            // fields: ['$id', Fields.TITLE, Fields.BODY, Fields.DELETED, "created_time", "dropdown"]
        };
        return this.jsonRequest('/k/v1/record', 'GET', data)
            .then(json => Note.fromJson(json.record))
    }

    // returns json
    // VisibleForTesting
    jsonRequest(path: string, method: 'GET' | 'POST', data: any): Promise<any> {
        const uri: string = `https://${this.config.cybozuHost}${path}.json`;
        const headers = new Headers();
        headers.append('Host', this.config.cybozuHost + ':443');
        headers.append('Content-Type', 'application/json');
        headers.append('X-Cybozu-Authorization', this.config.xCybozuAuthorization);
        headers.append('X-HTTP-Method-Override', method);
        const fetchData: RequestInit = {
            method: 'POST',
            body: JSON.stringify(data),
            headers: headers,
        };
        return fetch(uri, fetchData)
            .then(r => r.json())
            .catch(r => {
                console.log(`jsonRequest ERROR: ${path}`);
                throw new Error(r);
            });
    }

    add(note: Note): Note {
        return DUMMY_NOTE;
    }

    update(note: Note): void {
        return;
    }

    delete(id: number) : void {
        return;
    }
}