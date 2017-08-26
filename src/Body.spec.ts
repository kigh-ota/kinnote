import Body from './Body';
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
});