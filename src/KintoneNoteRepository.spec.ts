import KintoneNoteRepository from './KintoneNoteRepository';
import Note from './Note';
import * as assert from 'assert';
import KintoneNoteRepositoryConfig from './KintoneNoteRepositoryConfig';

describe('KintoneNoteRepository', () => {
    describe('get', () => {
        it('should return a dummy note', () => {
            const config = new KintoneNoteRepositoryConfig();
            let actual: Note = new KintoneNoteRepository(config).get();
            assert.equal(actual.getTitle(), 'title');
            assert.equal(actual.getBody(), 'body');
        });
    })
});
