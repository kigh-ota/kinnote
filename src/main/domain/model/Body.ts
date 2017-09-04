import {Tag} from './Note';

export default class Body {
    private value: string;

    constructor(body: string) {
        this.value = body;
    }

    public getValue(): string {
        return this.value;
    }

    public getNumberOfLines(): number {
        return (this.value.match(/\n/g) || []).length + 1;
    }

    public getTags(): Set<Tag> {
        return new Set(
            this.value
                .split('\n')
                .filter(line => {
                    return line.match(/^#\S+$/);
                }).map(line => {
                    return line.substring(1);
                }).filter(tag => {
                    return !tag.includes('#');
                })
            );
    }
}
