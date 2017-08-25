import KintoneNoteRepository from './KintoneNoteRepository';
import Note from './Note';
import * as assert from 'assert';

describe('KintoneNoteRepository', () => {
    describe('get', () => {
        it('should return a dummy note', () => {
            let actual: Note = new KintoneNoteRepository().get();
            assert.equal(actual.getTitle(), 'title');
            assert.equal(actual.getBody(), 'body');
        });
    })
});
