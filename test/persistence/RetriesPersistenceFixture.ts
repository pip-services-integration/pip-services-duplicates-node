import {TestModel} from "../data";

let _ = require('lodash');
let async = require('async');
let assert = require('chai').assert;

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { IRetriesPersistence } from '../../src/persistence/IRetriesPersistence';

export class RetriesPersistenceFixture {
    private _persistence: IRetriesPersistence;

    constructor(persistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }

    testGetRetryGroups(done) {
        // Add retries
        async.series([
            // create one Retry
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE1, callback);
            },
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE2, callback);
            },
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE3, callback);
            },
            (callback) => {

                this._persistence.getGroupNames(null, (err, items) => {
                    assert.isNull(err);
                    assert.equal(2, items.length);
                    assert.include(items, "c1");
                    assert.include(items, "c2");
                    callback();
                });

            }], done);
    }

    public testGetRetries(done) {

        async.series([
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE1, callback);
            },
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE2, callback);
            },
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE3, callback);
            },
            (callback) => {
                this._persistence.getPageByFilter(null, FilterParams.fromTuples("group", "c2"), new PagingParams(0, 10, false), (err, page) => {
                    assert.isNull(err);
                    assert.isNotNull(page.data);
                    assert.equal(2, page.data.length);
                    callback();
                });

            }], done);
    }

    public testGetRetry(done) {
        async.series([
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE1, callback);
            },
            (callback) => {
                // Test retries
                this._persistence.getById(null, TestModel.DUPLICATE1.group, TestModel.DUPLICATE1.id, (err, retry) => {
                    assert.isNull(err);
                    assert.equal(TestModel.DUPLICATE1.id, retry.id);
                    callback();
                });
            }], done);
    }

    public testRetry(done) {
        async.series([
            // Add retries
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE1, callback);
            },
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE2, callback);
            },
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE3, callback);
            },
            (callback) => {
                // Test retries
                this._persistence.getById(null, TestModel.DUPLICATE1.group, TestModel.DUPLICATE1.id, (err, retry) => {
                    assert.isNull(err);
                    assert.equal(TestModel.DUPLICATE1.id, retry.id);
                    callback();
                });
            },
            (callback) => {
                // Test different group
                this._persistence.getById(null, TestModel.DUPLICATE2.group, TestModel.DUPLICATE2.id, (err, retry) => {
                    assert.isNull(err);
                    assert.equal(TestModel.DUPLICATE2.id, retry.id);
                    callback();
                });
            }, 
            (callback) => {

                // Test non-exiting group
                this._persistence.getById(null, "c4", TestModel.DUPLICATE1.id, (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });

            }, (callback) => {

                // Test non-exiting retry
                this._persistence.getById(null, TestModel.DUPLICATE2.group, "4", (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });

            }, (callback) => {

                // Delete retry
                this._persistence.delete(null, TestModel.DUPLICATE3.group, TestModel.DUPLICATE3.id, (err) => {
                    assert.isNull(err);
                    this._persistence.getById(null, TestModel.DUPLICATE3.group, TestModel.DUPLICATE3.id, (e, retry) => {
                        assert.isNull(e);
                        assert.isNull(retry);
                        callback();
                    });

                });

            }], done);
    }

    public testExpiredRetries(done) {
        async.series([
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE1, callback);
            },
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE2, callback);
            },
            (callback) => {
                this._persistence.create(null, TestModel.DUPLICATE3, callback);
            }, (callback) => {
                // Wait to expire
                setTimeout(() => {
                    this._persistence.deleteExpired(null, callback);
                }, 500);

            }, (callback) => {
                // Try to read expired retries
                this._persistence.getById(null, "c1", "1", (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });

            }, (callback) => {
                this._persistence.getById(null, "c2", "2", (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });

            }, (callback) => {
                this._persistence.getById(null, "c2", "3", (err, retry) => {
                    assert.isNull(err);
                    assert.isNull(retry);
                    callback();
                });

            }], done);
    }

}
