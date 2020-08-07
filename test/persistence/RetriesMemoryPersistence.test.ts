import { ConfigParams } from 'pip-services3-commons-node';

import { RetriesMemoryPersistence } from '../../src/persistence/RetriesMemoryPersistence';
import { RetriesPersistenceFixture } from './RetriesPersistenceFixture';

suite('RetriesMemoryPersistence', ()=> {
    let persistence: RetriesMemoryPersistence;
    let fixture: RetriesPersistenceFixture;

    setup((done) => {
        persistence = new RetriesMemoryPersistence();
        persistence.configure(new ConfigParams());

        fixture = new RetriesPersistenceFixture(persistence);

        persistence.open(null, done);
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('Retry groups', (done) => {
        fixture.testGetRetryGroups(done);
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