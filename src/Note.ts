// Note Entity


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

    constructor(id: NoteId, title: Title, body: Body, deleted: boolean) {
        this.id = id;
        if (title == '') {
            throw new Error();
        }
        this.title = title;
        this.body = body;
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

    getId(): NoteId {
        return this.id;
    }

    getTitle(): string {
        return this.title;
    }

    getBody(): string {
        return this.body;
    }

    isDeleted(): boolean {
        return this.deleted;
    }

    getTags(): Tag[] {
        return ['TAG1', 'TAG2'];
    }
}

type NoteId = number | null;
type Title = string;
type Body = string;
type Tag = string;
