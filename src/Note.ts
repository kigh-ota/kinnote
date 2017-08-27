// Note Entity


import Body from './Body';
import Timestamp, {TimestampValue} from './Timestamp';

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

export default class Note {
    private id: NoteId;
    private title: Title;
    private body: Body;
    private createdAt: Timestamp;
    private updatedAt: Timestamp;
    private deleted: boolean;

    constructor(id: NoteId, title: Title, body: string, deleted: boolean, createdAt: TimestampValue, updatedAt: TimestampValue) {
        this.id = id;
        this.title = title;
        this.body = new Body(body);
        this.createdAt = new Timestamp(createdAt);
        this.updatedAt = new Timestamp(updatedAt);
        this.deleted = deleted;
    }

    static fromJson(json: any): Note {
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

    static emptyNote(): Note {
        return new Note(null, '', '', false, null, null);
    }

    getId(): NoteId {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getBody(): string {
        return this.body.getValue();
    }

    getCreatedAt(): Timestamp {
        return this.createdAt;
    }

    getUpdatedAt(): Timestamp {
        return this.updatedAt;
    }

    isDeleted(): boolean {
        return this.deleted;
    }

    getTags(): Set<Tag> {
        return this.body.getTags();
    }
}

type NoteId = number | null;
type Title = string;
export type Tag = string;
