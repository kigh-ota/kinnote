import NoteCache from '../../main/application/NoteCache';
import Note from '../../main/domain/model/Note';
import * as assert from 'assert';

describe('NoteCache', () => {
    it('cannot be added a note without id', () => {
        const sut = new NoteCache();
        const note = new Note(null, 'TITLE', 'BODY', false, null, null);
        assert.throws(sut.add.bind(this, note), Error);
    });

    it('should be added a note', () => {
        const sut = new NoteCache();
        const ID = 1;
        const note = new Note(ID, 'TITLE', 'BODY', false, null, null);
        sut.add(note);
        const actual = sut.get(ID);
        assert.deepStrictEqual(actual, note);
    });

    describe('delete', () => {
        it('should turn on the flag', () => {
            const sut = new NoteCache();
            const ID = 1;
            const note = new Note(ID, 'TITLE', 'BODY', false, null, null);
            sut.add(note);
            assert.equal(sut.isDeleted(ID), false);
            sut.remove(ID);
            assert.equal(sut.isDeleted(ID), true);
        });
    });

    describe('update', () => {
        it('should turn on the flag', () => {
            const sut = new NoteCache();
            const ID = 1;
            const note = new Note(ID, 'TITLE', 'BODY', false, null, null);
            sut.add(note);
            assert.equal(sut.isModified(ID), false);
            sut.update(ID, 'TITLE2', 'BODY2');
            assert.equal(sut.isModified(ID), true);
            assert.equal(sut.isDeleted(ID), false);
            const actual = sut.get(ID);
            assert.equal(actual.getTitle(), 'TITLE2');
            assert.equal(actual.getBody(),'BODY2');
        })
    });

});
