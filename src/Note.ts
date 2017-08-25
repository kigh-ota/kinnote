// Note Entity

export default class Note {
    private id: NoteId;
    private title: Title;
    private body: Body;

    constructor(id: NoteId, title: Title, body: Body) {
        this.id = id;
        if (title == '') {
            throw new Error();
        }
        this.title = title;
        this.body = body;
    }

    getTitle(): string {
        return this.title;
    }

    getBody(): string {
        return this.body;
    }

    getTags(): Tag[] {
        return ['TAG1', 'TAG2'];
    }
}

type NoteId = number | null;
type Title = string;
type Body = string;
type Tag = string;
