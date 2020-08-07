let process = require('process');

import { ConfigParams } from 'pip-services3-commons-node';

import { RetriesMongoDbPersistence } from '../../src/persistence/RetriesMongoDbPersistence';
import { RetriesPersistenceFixture } from './RetriesPersistenceFixture';

suite('RetriesMongoDbPersistence', () => {
    let persistence: RetriesMongoDbPersistence;
    let fixture: RetriesPersistenceFixture;

    setup((done) => {
        var MONGO_DB = process.env["MONGO_DB"] || "test";
        var MONGO_COLLECTION = process.env["MONGO_COLLECTION"] || "retries";
        var MONGO_SERVICE_HOST = process.env["MONGO_SERVICE_HOST"] || "localhost";
        var MONGO_SERVICE_PORT = process.env["MONGO_SERVICE_PORT"] || "27017";
        var MONGO_SERVICE_URI = process.env["MONGO_SERVICE_URI"];

        var dbConfig = ConfigParams.fromTuples(
            "collection", MONGO_COLLECTION,
            "connection.database", MONGO_DB,
            "connection.host", MONGO_SERVICE_HOST,
            "connection.port", MONGO_SERVICE_PORT,
            "connection.uri", MONGO_SERVICE_URI
        );

        persistence = new RetriesMongoDbPersistence();
        persistence.configure(dbConfig);

        fixture = new RetriesPersistenceFixture(persistence);

        persistence.open(null, (err: any) => {
            persistence.clear(null, (err) => {
                done(err);
            });
        });
    });

    teardown((done) => {
        persistence.close(null, done);
    });

    test('Retry groups', (done) => {
        fixture.testGetRetryGroups(done);
    });


    test('Get Retry', (done) => {
        fixture.testGetRetry(done);
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