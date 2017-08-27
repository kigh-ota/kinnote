import Body from '../../../main/domain/model/Body';
import * as assert from 'assert';

describe('Body', () => {
    describe('getNumberOfLines', () => {
        it('should return 1 for empty string', () => {
            assert.equal(new Body('').getNumberOfLines(), 1);
        });

        it('should return 1', () => {
            assert.equal(new Body('1').getNumberOfLines(), 1);
        });

        it('should return 2', () => {
            assert.equal(new Body('あいうえお\nかきくけこ').getNumberOfLines(), 2);
        });
    });

    describe('getTags', () => {
        it('should parse unique tags', () => {
            assertSet(new Body('').getTags(), []);
            assertSet(new Body('#a').getTags(), ['a']);
            assertSet(new Body('#a#').getTags(), []);
            assertSet(new Body('#a\n#b').getTags(), ['a', 'b']);
            assertSet(new Body('#a\n#a').getTags(), ['a']);
        });

        function assertSet<T>(set: Set<T>, values: T[]): void {
            assert.equal(set.size, values.length);
            values.forEach(v => {
                assert.ok(set.has(v));
            })
        }
    });
});
