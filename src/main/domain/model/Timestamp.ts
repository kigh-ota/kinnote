export type TimestampValue = Date | null;

export default class Timestamp {

    private value: TimestampValue;

    constructor(value: TimestampValue) {
        this.value = value;
    }

    static compare(a: Timestamp, b: Timestamp) {
        return b.compValue() - a.compValue();
    }

    private compValue(): number {
        if (this.value instanceof Date) {
            return this.value.getTime();
        }
        return Number.MAX_VALUE;
    }
}
