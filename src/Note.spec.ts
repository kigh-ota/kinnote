import Note from './Note';
import * as assert from 'assert';

describe('Note', () => {
    describe('emptyNote', () => {
        it('should return an empty note', () => {
            const actual = Note.emptyNote();
            assert.equal(actual.getId(), null);
            assert.equal(actual.getTitle(), '');
            assert.equal(actual.getBody(), '');
            assert.equal(actual.isDeleted(), false);
        });
    });
});