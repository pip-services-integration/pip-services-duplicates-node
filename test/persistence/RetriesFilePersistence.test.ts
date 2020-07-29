import { RetriesFilePersistence } from '../../src/persistence/RetriesFilePersistence';
import { RetriesPersistenceFixture } from './RetriesPersistenceFixture';

suite('RetriesFilePersistence', () => {
    let persistence: RetriesFilePersistence;
    let fixture: RetriesPersistenceFixture;

    setup((done) => {
        persistence = new RetriesFilePersistence('./data/retries.test.json');

        fixture = new RetriesPersistenceFixture(persistence);

        persistence.open(null, (err) => {
            persistence.clear(null, done);
        });
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('Retry collections', (done) => {
        fixture.testGetRetryCollections(done);
    });

    test('Get Retries', (done) => {
        fixture.testGetRetries(done);
    });

    test('Retries', (done) => {
        fixture.testRetry(done);
    });

    test('Expired Retries', (done) => {
        fixture.testExpiredRetries(done);
    });

});