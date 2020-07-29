let _ = require('lodash');
let async = require('async');
let restify = require('restify');
let assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-node';
import { Descriptor } from 'pip-services3-commons-node';
import { References } from 'pip-services3-commons-node';

import { RetryV1 } from '../../../src/data/version1';
import { RetriesMemoryPersistence } from '../../../src/persistence';
import { RetriesController } from '../../../src/logic';
import { RetriesHttpServiceV1 } from '../../../src/services/version1';

import {TestModel} from "../../data";

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);



suite('RetriesHttpServiceV1', ()=> {    
    let service: RetriesHttpServiceV1;
    let rest: any;

    suiteSetup((done) => {
        let persistence = new RetriesMemoryPersistence();
        let controller = new RetriesController();

        service = new RetriesHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('pip-services-retries', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('pip-services-retries', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('pip-services-retries', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        service.open(null, done);
    });

    suiteTeardown((done) => {
        service.close(null, done);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });


    test('Test Retries', (done) => {
        let retry1, retry2: RetryV1;

        var date = new Date(new Date().toUTCString())
        date.setDate(date.getDate() + 3);
        var expirationTimeUtc = date;
        
        TestModel.DUPLICATE1.expiration_time = expirationTimeUtc;
        TestModel.DUPLICATE2.expiration_time = expirationTimeUtc;
        TestModel.DUPLICATE3.expiration_time = expirationTimeUtc;
        
        async.series([
        // Create one Retry
            (callback) => {
                rest.post('/v1/retries/add_retry',
                    {
                        id: TestModel.DUPLICATE1.id,
                        collection: TestModel.DUPLICATE1.collection,
                        ttl: 3
                    },
                    (err, req, res, retry) => {
                        assert.isNull(err);

                        assert.isObject(retry);
                        assert.equal(retry.id, TestModel.DUPLICATE1.id);
                        assert.equal(retry.collection, TestModel.DUPLICATE1.collection);
                        assert.equal(retry.attempt_count, TestModel.DUPLICATE1.attempt_count);

                        retry1 = retry;

                        callback();
                    }
                );
            },
        // Create another Retry
            (callback) => {
                rest.post('/v1/retries/add_retry', 
                    {
                        id: TestModel.DUPLICATE2.id,
                        collection: TestModel.DUPLICATE2.collection,
                        ttl: 2
                    },
                    (err, req, res, retry) => {
                        assert.isNull(err);

                        assert.isObject(retry);
                        assert.equal(retry.id, TestModel.DUPLICATE2.id);
                        assert.equal(retry.collection, TestModel.DUPLICATE2.collection);
                        assert.equal(retry.attempt_count, TestModel.DUPLICATE2.attempt_count);

                        retry2 = retry;

                        callback();
                    }
                );
            },
        // Get all Retries
            (callback) => {
                rest.post('/v1/retries/get_retries',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 2);

                        callback();
                    }
                );
            },
        // Update the Retry
            (callback) => {
                retry1.name = 'Updated Retry 2';

                rest.post('/v1/retries/add_retry',
                    {
                        id: TestModel.DUPLICATE2.id,
                        collection: TestModel.DUPLICATE2.collection,
                        ttl: 3
                    },
                    (err, req, res, retry) => {
                        assert.isNull(err);

                        assert.isObject(retry);
                        assert.equal(retry.id, TestModel.DUPLICATE2.id);
                        assert.equal(retry.collection, TestModel.DUPLICATE2.collection);
                        assert.equal(retry.attempt_count, 2);

                        retry1 = retry;

                        callback();
                    }
                );
            },
            // Delete 1 Retry 
            (callback) => {
                rest.post('/v1/retries/delete_retry',
                    {
                        id: TestModel.DUPLICATE1.id,
                        collection: TestModel.DUPLICATE1.collection,
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            // Delete 2 Retry 
            (callback) => {
                rest.post('/v1/retries/delete_retry',
                    {
                        id: TestModel.DUPLICATE2.id,
                        collection: TestModel.DUPLICATE2.collection,
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
        // Try to get delete Retry
            (callback) => {
                rest.post('/v1/retries/get_retry_by_id',
                    {
                        id: TestModel.DUPLICATE1.id,
                        collection: TestModel.DUPLICATE1.collection,
                    },
                    (err, req, res, result) => {
                        assert.isNull(err);

                        callback();
                    }
                );
            },
            (callback) => {
                rest.post('/v1/retries/add_retry',
                    {
                        id: TestModel.DUPLICATE1.id,
                        collection: TestModel.DUPLICATE1.collection,
                        ttl: 3
                    },
                    (err, req, res, retry) => {
                        assert.isNull(err);

                        assert.isObject(retry);
                        assert.equal(retry.id, TestModel.DUPLICATE1.id);
                        assert.equal(retry.collection, TestModel.DUPLICATE1.collection);
                        assert.equal(retry.attempt_count, TestModel.DUPLICATE1.attempt_count);

                        callback();
                    }
                );
            },
            // Create 2 Retry
            (callback) => {
                rest.post('/v1/retries/add_retry',
                    {
                        id: TestModel.DUPLICATE2.id,
                        collection: TestModel.DUPLICATE2.collection,
                        ttl: 2
                    },
                    (err, req, res, retry) => {
                        assert.isNull(err);

                        assert.isObject(retry);
                        assert.equal(retry.id, TestModel.DUPLICATE2.id);
                        assert.equal(retry.collection, TestModel.DUPLICATE2.collection);
                        assert.equal(retry.attempt_count, TestModel.DUPLICATE2.attempt_count);


                        callback();
                    }
                );
            },
            // Create 3 Retry
            (callback) => {
                rest.post('/v1/retries/add_retry',
                    {
                        id: TestModel.DUPLICATE3.id,
                        collection: TestModel.DUPLICATE3.collection,
                        ttl: 2
                    },
                    (err, req, res, retry) => {
                        assert.isNull(err);

                        assert.isObject(retry);
                        assert.equal(retry.id, TestModel.DUPLICATE3.id);
                        assert.equal(retry.collection, TestModel.DUPLICATE3.collection);
                        assert.equal(retry.attempt_count, TestModel.DUPLICATE3.attempt_count);


                        callback();
                    }
                );
            },
            // Get all Retries
            (callback) => {
                rest.post('/v1/retries/get_retries',
                    {},
                    (err, req, res, page) => {
                        assert.isNull(err);

                        assert.isObject(page);
                        assert.lengthOf(page.data, 3);

                        callback();
                    }
                );
            },
            // Get all collections
            (callback) => {
                rest.post('/v1/retries/get_collection_names',
                    {},
                    (err, req, res, collections) => {
                        assert.isNull(err);
                        assert.isNotNull(collections);
                        assert.equal(2, collections.length);
                        assert.include(collections, "c1");
                        assert.include(collections, "c2");
                        callback();
                    })
            }
        ], done);
    });
});