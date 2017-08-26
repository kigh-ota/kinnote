// Note Entity


import Body from './Body';

const Fields: any = {
    ID: '$id',
    TITLE: 'title',
    BODY: 'body',
    DELETED: 'deleted',
};

const Values: any = {
    DELETED: 'deleted',
};

export default class Note {
    private id: NoteId;
    private title: Title;
    private body: Body;
    private deleted: boolean;

    constructor(id: NoteId, title: Title, body: string, deleted: boolean) {
        this.id = id;
        this.title = title;
        this.body = new Body(body);
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
        )
    }

    static emptyNote(): Note {
        return new Note(null, '', '', false);
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

    getBodyLines(): number {
        return this.body.getNumberOfLines();
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
