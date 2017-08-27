import * as assert from 'assert';
import Timestamp from './Timestamp';

describe('Timestamp', () => {
    describe('compare', () => {
        it('', () => {
            const someTs = new Timestamp(new Date("2015-09-01"));
            const nullTs = new Timestamp(null);
            const zeroTs = new Timestamp(new Date(0));
            assert.ok(Timestamp.compare(someTs, someTs) === 0);
            assert.ok(Timestamp.compare(nullTs, nullTs) === 0);
            assert.ok(Timestamp.compare(zeroTs, someTs) > 0);
            assert.ok(Timestamp.compare(someTs, nullTs) > 0);
        });
    });
});