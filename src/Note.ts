// Note Entity

export default class Note {
    private title: String;  // TODO: not to be empty
    private body: String;

    constructor(title: String, body: String) {
        if (title == '') {
            throw new Error();
        }
        this.title = title;
        this.body = body;
    }
}
