export default class Body {
    private value: string;

    constructor(body: string) {
        this.value = body;
    }

    getValue(): string {
        return this.value;
    }

    getNumberOfLines(): number {
        return (this.value.match(/\n/g) || []).length + 1;
    }
}
