let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { RetriesMemoryPersistence } from "../../src/persistence/RetriesMemoryPersistence";
import { ConfigParams, Descriptor, References, FilterParams, PagingParams } from "pip-services3-commons-node";
import { RetriesController } from "../../src/logic/RetriesController";

suite('Retries Controller', () => {
    let _persistence: RetriesMemoryPersistence;
    let _controller: RetriesController;

    setup((done) => {
        _persistence = new RetriesMemoryPersistence();
        _controller = new RetriesController();
        _persistence.configure(new ConfigParams());
        var references = References.fromTuples(
            new Descriptor("pip-services-retries", "persistence", "mock", "default", "1.0"), _persistence
        );
        _controller.setReferences(references);
        _persistence.open(null, done);
    });

    teardown((done) => {
        _persistence.close(null, done);
    });

    test('Test Get Retry Collections', (done) => {
        async.series([
            // Add retries
            (callback) => {
                _controller.addRetry(null, "Common.Collection", "123", 3, callback);
            }, (callback) => {
                _controller.addRetry(null, "Common.AnotherCollection", "123", 3, callback);
            }, (callback) => {
                _controller.addRetry(null, "Common.Collection", "ABC", 3, callback);
            }, (callback) => {

                _controller.getCollectionNames(null, (err, items) => {
                    assert.isNull(err);
                    assert.equal(2, items.length);
                    assert.include(items, "Common.Collection");
                    assert.include(items, "Common.AnotherCollection");
                    callback();
                });

            }], done);
    });


    test('Test Get Retries', (done) => {

        async.series([// Add retries
            (callback) => {
                _controller.addRetry(null, "Common.Collection", "123", 3, callback);
            }, (callback) => {
                _controller.addRetry(null, "Common.AnotherCollection", "123", 3, callback);
            }, (callback) => {
                _controller.addRetry(null, "Common.Collection", "ABC", 3, callback);
            }, (callback) => {
                _controller.addRetry(null, "Common.Collection", "AAA", 3, callback);
            }, (callback) => {
                _controller.getRetries(null, FilterParams.fromTuples("collection", "Common.Collection"), new PagingParams(1, 10, false), (err, retries) => {
                    assert.isNull(err);
                    assert.isNotNull(retries.data);
                    assert.equal(2, retries.data.length);
                    callback();
                });

            }], done);
    });


    test('Test Retries', (done) => {

        async.series([
            // Add retries
            (callback) => {
                _controller.addRetry(null, "Common.Collection", "123", 3, callback);;
            }, (callback) => {
                _controller.addRetry(null, "Common.AnotherCollection", "123", 3, callback);
            }, (callback) => {
                _controller.addRetry(null, "Common.OtherCollection", "ABC", 3, callback);
            }, (callback) => {
                // Try to read 1 retry
                _controller.getRetryById(null, "Common.Collection", "123", (err, retry) => {
                    assert.isNull(err);
                    assert.isNotNull(retry);
                    assert.equal(retry.id, "123");
                    assert.equal(retry.collection, "Common.Collection");
                    callback();
                });

            }, (callback) => {
                // Try to read 2 retry
                _controller.getRetryById(null, "Common.AnotherCollection", "123", (err, retry) => {
                    assert.isNull(err);
                    assert.isNotNull(retry);
                    assert.equal(retry.id, "123");
                    assert.equal(retry.collection, "Common.AnotherCollection");
                    callback();
                });

            }, (callback) => {
                // Try to read 3 retry
                _controller.getRetryById(null, "Common.OtherCollection", "ABC", (err, retry) => {
                    assert.isNull(err);
                    assert.isNotNull(retry);
                    assert.equal(retry.id, "ABC");
                    assert.equal(retry.collection, "Common.OtherCollection");
                    callback();
                });

            }, (callback) => {
                // Test non-exiting collection
                _controller.getRetryById(null, "Common.Collection1", "123", (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });
            }, (callback) => {
                // Test non-exiting retry
                _controller.getRetryById(null, "Common.Collection", "1234", (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });

            }], done);
    });


    test('Test Expired Retries', (done) => {

        async.series([
            // Add retries
            (callback) => {
                _controller.addRetry(null, "Common.Collection", "123", 0, callback);
            }, (callback) => {
                _controller.addRetry(null, "Common.Collection", "ABC", 0, callback);
            }, (callback) => {

                // Wait to expire
                setTimeout(() => {
                    _controller.deleteExpiredRetries(null, callback);
                }, 500);
            }, (callback) => {
                // Try to read expired retries
                _controller.getRetryById(null, "Common.Collection", "123", (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });
            }, (callback) => {
                _controller.getRetryById(null, "Common.Collection", "ABC", (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });

            }], done);
    });

});