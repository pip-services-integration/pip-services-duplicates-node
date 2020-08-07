"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let async = require('async');
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const RetriesCommandSet_1 = require("./RetriesCommandSet");
class RetriesController {
    constructor() {
        this.component = "Integration.RetriesController";
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._counters = new pip_services3_components_node_1.CompositeCounters();
        this._dependencyResolver = new pip_services3_commons_node_2.DependencyResolver(RetriesController._defaultConfig);
    }
    configure(config) {
        this._dependencyResolver.configure(config);
    }
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
    }
    getCommandSet() {
        return this._commandSet || (this._commandSet = new RetriesCommandSet_1.RetriesCommandSet(this));
    }
    instrument(correlationId, methodName) {
        this._logger.trace(correlationId, "Executed %s.%s %s", this.component, methodName);
        return this._counters.beginTiming(this.component + "." + methodName + ".exec_time");
    }
    getGroupNames(correlationId, callback) {
        let time = this.instrument(correlationId, "getGroupNames");
        this._persistence.getGroupNames(correlationId, (err, items) => {
            time.endTiming();
            if (err) {
                this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "getGroupNames");
            }
            callback(err, items);
        });
    }
    createRetries(group, ids, timeToLive) {
        let now = new Date();
        let expirationTime = new Date(Date.now() + timeToLive);
        let result = [];
        for (let _id of ids) {
            let retry = {
                id: _id,
                group: group,
                last_attempt_time: now,
                expiration_time: expirationTime,
                attempt_count: 1
            };
            result.push(retry);
        }
        return result;
    }
    addRetries(correlationId, group, ids, timeToLive, callback) {
        let time = this.instrument(correlationId, "addRetries");
        let result = [];
        if (group == null || ids == null || ids.length == 0) {
            return result;
        }
        let retries;
        async.series([
            (callback) => {
                retries = this.createRetries(group, ids, timeToLive);
                callback();
            },
            (callback) => {
                let index = retries.length - 1;
                async.whilst(() => { return index >= 0; }, (cb) => {
                    let retry = retries[index--];
                    this._persistence.getById(correlationId, retry.group, retry.id, (err, item) => {
                        if (err)
                            this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "addRetries");
                        if (item != null) {
                            retry.attempt_count = ++item.attempt_count;
                            retry.last_attempt_time = new Date();
                            this._persistence.update(correlationId, retry, (err, updatedItem) => {
                                if (err)
                                    this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "addRetries");
                                else
                                    result.push(updatedItem);
                                cb(err);
                            });
                        }
                        else {
                            this._persistence.create(correlationId, retry, (err, item) => {
                                if (err)
                                    this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "addRetries");
                                else
                                    result.push(item);
                                cb(err);
                            });
                        }
                    });
                }, (err) => {
                    callback(err);
                });
            }
        ], (err) => {
            time.endTiming();
            callback(err, result);
        });
    }
    addRetry(correlationId, group, id, timeToLive, callback) {
        let time = this.instrument(correlationId, "addRetries");
        let result = null;
        if (group == null || id == null) {
            return result;
        }
        let retry;
        async.series([
            (callback) => {
                retry = this.createRetries(group, [id], timeToLive)[0];
                callback();
            },
            (callback) => {
                this._persistence.getById(correlationId, retry.group, retry.id, (err, item) => {
                    if (err) {
                        this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "addRetries");
                        callback(err);
                    }
                    if (item != null) {
                        retry.attempt_count = ++item.attempt_count;
                        retry.last_attempt_time = new Date();
                        this._persistence.update(correlationId, retry, (err, updatedItem) => {
                            if (err)
                                this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "addRetries");
                            else
                                result = updatedItem;
                            callback(err);
                        });
                    }
                    else {
                        this._persistence.create(correlationId, retry, (err, createdRetry) => {
                            if (err)
                                this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "addRetries");
                            else
                                result = createdRetry;
                            callback(err);
                        });
                    }
                });
            }
        ], (err) => {
            time.endTiming();
            callback(err, result);
        });
    }
    getRetries(correlationId, filter, paging, callback) {
        let time = this.instrument(correlationId, "getRetries");
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, result) => {
            time.endTiming();
            callback(err, result);
        });
    }
    getRetryById(correlationId, group, id, callback) {
        let time = this.instrument(correlationId, "getRetryById");
        this._persistence.getById(correlationId, group, id, (err, retry) => {
            time.endTiming();
            callback(err, retry);
        });
    }
    getRetryByIds(correlationId, group, ids, callback) {
        let time = this.instrument(correlationId, "getRetryByIds");
        this._persistence.getByIds(correlationId, group, ids, (err, retries) => {
            time.endTiming();
            callback(err, retries);
        });
    }
    deleteRetry(correlationId, group, id, callback) {
        let time = this.instrument(correlationId, "deleteRetry");
        this._persistence.delete(correlationId, group, id, (err) => {
            time.endTiming();
            callback(err);
        });
    }
    deleteExpiredRetries(correlationId, callback) {
        let time = this.instrument(correlationId, "deleteExpiredRetriess");
        this._persistence.deleteExpired(correlationId, (err) => {
            time.endTiming();
            if (err)
                this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "deleteExpiredRetriess");
            callback(err);
        });
    }
}
exports.RetriesController = RetriesController;
RetriesController._defaultConfig = pip_services3_commons_node_1.ConfigParams.fromTuples('dependencies.persistence', 'pip-services-retries:persistence:*:*:1.0');
//# sourceMappingURL=RetriesController.js.map