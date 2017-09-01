import NoteCache from '../../main/domain/model/NoteCache';
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

    describe('remove', () => {
        it('should turn on the flag', () => {
            const sut = new NoteCache();
            const ID = 1;
            const note = new Note(ID, 'TITLE', 'BODY', false, null, null);
            sut.add(note);
            assert.equal(sut.needsDeletion(ID), false);
            sut.remove(ID);
            assert.equal(sut.needsDeletion(ID), true);
        });
    });

    describe('update', () => {
        it('should turn on the flag', () => {
            const sut = new NoteCache();
            const ID = 1;
            const note = new Note(ID, 'TITLE', 'BODY', false, null, null);
            sut.add(note);
            assert.equal(sut.needsUpdate(ID), false);
            sut.update(ID, 'TITLE2', 'BODY2');
            assert.equal(sut.needsUpdate(ID), true);
            assert.equal(sut.needsDeletion(ID), false);
            const actual = sut.get(ID);
            assert.equal(actual.getTitle(), 'TITLE2');
            assert.equal(actual.getBody(),'BODY2');
        });
    });

    describe('needsUpdate', () => {
        it('should always return false when needsDeletion is true', () => {
            const sut = new NoteCache();
            const ID = 1;
            const note = new Note(ID, 'TITLE', 'BODY', false, null, null);
            sut.add(note);
            sut.update(ID, 'TITLE2', 'BODY2');
            sut.remove(ID);
            assert.equal(sut.needsUpdate(ID), false);
            assert.equal(sut.needsDeletion(ID), true);
        });
    });
});
