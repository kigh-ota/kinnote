import KintoneNoteRepository from '../../main/infrastructure/KintoneNoteRepository';
import * as assert from 'assert';
import KintoneNoteRepositoryConfig from '../../main/infrastructure/KintoneNoteRepositoryConfig';
import * as sinon from 'sinon';

const ID = 99;
const TITLE = 'title';
const BODY = 'body';
const DUMMY_JSON = {
    record: {
        '$id': {value: ID},
        'title': {value: TITLE},
        'body': {value: BODY},
        'deleted': {value: []},
        'createdAt': {value: '2017-08-27T15:57:00Z'},
        'updatedAt': {value: '2017-08-27T15:57:00Z'},
    }
};

describe('KintoneNoteRepository', () => {
    describe('get', () => {
        it('should call jsonRequest', () => {
            const APP_ID: number = 999;
            let config = new KintoneNoteRepositoryConfig();
            config.appId = APP_ID;
            const sut = new KintoneNoteRepository(config);
            const spy = sinon.stub(sut, 'jsonRequest').resolves(DUMMY_JSON);
            sut.get(ID).then(note => {
                sinon.assert.calledOnce(spy);
                assert.ok(spy.calledWith('/k/v1/record', 'GET', {
                    app: APP_ID,
                    id: ID,
                }));
                assert.equal(note.getTitle(), TITLE);
                assert.equal(note.getBody(), BODY);
                assert.equal(note.isDeleted(), false);
            });
        });
    });

    describe('getAll', () => {});
    describe('add', () => {});
    describe('update', () => {});
    describe('remove', () => {});
});
