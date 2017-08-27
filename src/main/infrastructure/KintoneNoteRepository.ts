import Note, {NoteId} from '../domain/model/Note';
import NoteRepository from '../domain/model/NoteRepository';
import KintoneNoteRepositoryConfig from './KintoneNoteRepositoryConfig';

const DUMMY_NOTE: Note = new Note(1, 'title', 'body', false, null, null);

type HttpMethod = 'GET'|'POST'|'PUT'|'DELETE';

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
            .then(json => json.records.map((r: any) => this.jsonToNote(r)))
    }

    get(id: number):Promise<Note> {
        const data: object = {
            app: this.config.appId,
            id: id,
            // fields: ['$id', Fields.TITLE, Fields.BODY, Fields.DELETED, "created_time", "dropdown"]
        };
        return this.jsonRequest('/k/v1/record', 'GET', data)
            .then(json => this.jsonToNote(json.record))
    }

    // returns json
    // VisibleForTesting
    jsonRequest(path: string, method: HttpMethod, data: any): Promise<any> {
        return kintone.api(path, method, data);
    }

    add(note: Note): Promise<NoteId> {
        if (note.getId() !== null) {
            throw new Error();
        }
        const data: object = {
            app: this.config.appId,
            record: {
                [Fields.TITLE]: {value: note.getTitle()},
                [Fields.BODY]: {value: note.getBody()},
                [Fields.DELETED]: {value: []},
            },
        };
        return this.jsonRequest('/k/v1/record', 'POST', data)
            .then(json => json.id);
    }

    update(note: Note): Promise<void> {
        if (note.getId() === null) {
            throw new Error();
        }
        const data: object = {
            app: this.config.appId,
            id: note.getId(),
            record: {
                [Fields.TITLE]: {value: note.getTitle()},
                [Fields.BODY]: {value: note.getBody()},
            },
        };
        return this.jsonRequest('/k/v1/record', 'PUT', data)
            .then(json => {return;});
    }

    deleteLogically(id: number) : Promise<void> {
        const data: object = {
            app: this.config.appId,
            id: id,
            record: {
                [Fields.DELETED]: {value: [Values.DELETED]},
            },
        };
        return this.jsonRequest('/k/v1/record', 'PUT', data)
            .then(json => {return;});
    }

    private jsonToNote(json: any): Note {
        if (Object.keys(Fields).some((key: string) => !json.hasOwnProperty(Fields[key]))) {
            throw new Error('Json does not contain a required field.');
        }
        return new Note(
            parseInt(json[Fields.ID].value, 10),
            json[Fields.TITLE].value,
            json[Fields.BODY].value,
            json[Fields.DELETED].value.includes(Values.DELETED),
            json[Fields.CREATED_AT].value,
            json[Fields.UPDATED_AT].value,
        )
    }
}

const Fields: any = {
    ID: '$id',
    TITLE: 'title',
    BODY: 'body',
    DELETED: 'deleted',
    CREATED_AT: 'createdAt',
    UPDATED_AT: 'updatedAt',
};

const Values: any = {
    DELETED: 'deleted',
};