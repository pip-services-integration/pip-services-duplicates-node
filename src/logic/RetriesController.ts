let async = require('async');

import { CompositeCounters, CompositeLogger, Timing } from "pip-services3-components-node";
import { ConfigParams, SortParams } from 'pip-services3-commons-node';
import { IConfigurable } from 'pip-services3-commons-node';
import { IReferences } from 'pip-services3-commons-node';
import { IReferenceable } from 'pip-services3-commons-node';
import { DependencyResolver } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { ICommandable } from 'pip-services3-commons-node';
import { CommandSet } from 'pip-services3-commons-node';

import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from '../persistence';
import { IRetriesController } from './IRetriesController';
import { RetriesCommandSet } from './RetriesCommandSet';

export class RetriesController implements IConfigurable, IReferenceable, ICommandable, IRetriesController {
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'pip-services-retries:persistence:*:*:1.0'
    );

    public readonly component: string = "Integration.RetriesController";

    private _logger: CompositeLogger = new CompositeLogger();
    private _counters: CompositeCounters = new CompositeCounters();
    private _dependencyResolver: DependencyResolver = new DependencyResolver(RetriesController._defaultConfig);
    private _persistence: IRetriesPersistence;
    private _commandSet: RetriesCommandSet;

    public configure(config: ConfigParams): void {
        this._dependencyResolver.configure(config);
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired<IRetriesPersistence>('persistence');
    }

    public getCommandSet(): CommandSet {
        return this._commandSet || (this._commandSet = new RetriesCommandSet(this));
    }

    protected instrument(correlationId: string, methodName: string): Timing {
        this._logger.trace(correlationId, "Executed %s.%s %s", this.component, methodName);
        return this._counters.beginTiming(this.component + "." + methodName + ".exec_time");
    }

    public getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void) {
        let time = this.instrument(correlationId, "getCollectionNames");
        this._persistence.getCollectionNames(correlationId, (err, items) => {
            time.endTiming();
            if (err) {
                this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "getCollectionNames");
            }
            callback(err, items);
        });
    }

    private createRetries(collection: string, ids: string[], timeToLive: number): RetryV1[] {
        let now = new Date();
        let expirationTime = new Date(Date.now() + timeToLive);
        let result: RetryV1[] = [];

        for (let _id of ids) {
            let retry: RetryV1 = {
                id: _id,
                collection: collection,
                last_attempt_time: now,
                expiration_time: expirationTime,
                attempt_count: 1
            }
            result.push(retry);
        }
        return result;
    }

    public addRetries(correlationId: string, collection: string, ids: string[], timeToLive: number, callback: (err: any, retry: RetryV1[]) => void) {
        let time = this.instrument(correlationId, "addRetries");
        let result: RetryV1[] = [];
        if (collection == null || ids == null || ids.length == 0) {
            return result;
        }

        let retries: RetryV1[];

        async.series([
            (callback) => {
                retries = this.createRetries(collection, ids, timeToLive);
                callback();
            },
            (callback) => {
                let index = retries.length - 1;
                async.whilst(() => { return index >= 0 },
                    (cb) => {
                        let retry = retries[index--];
                        this._persistence.getById(correlationId, retry.collection, retry.id, (err, item) => {
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
                            } else {
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

    public addRetry(correlationId: string, collection: string, id: string, timeToLive: number, callback: (err: any, retry: RetryV1) => void) {
        let time = this.instrument(correlationId, "addRetries");
        let result: RetryV1 = null;
        if (collection == null || id == null) {
            return result;
        }
        let retry: RetryV1;

        async.series([
            (callback) => {
                retry = this.createRetries(collection, [id], timeToLive)[0];
                callback();
            },
            (callback) => {
                this._persistence.getById(correlationId, retry.collection, retry.id, (err, item) => {
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
                    } else {
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

    public getRetries(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<RetryV1>) => void): void {
        let time = this.instrument(correlationId, "getRetries");
        this._persistence.getPageByFilter(correlationId, filter, paging, (err, result) => {
            time.endTiming();
            callback(err, result);
        });
    }

    public getRetryById(correlationId: string, collection: string, id: string, callback: (err: any, retry: RetryV1) => void): void {
        let time = this.instrument(correlationId, "getRetryById");
        this._persistence.getById(correlationId, collection, id, (err, retry) => {
            time.endTiming();
            callback(err, retry);
        });
    }

    public getRetryByIds(correlationId: string, collection: string, ids: string[], callback: (err: any, retry: RetryV1[]) => void) {
        let time = this.instrument(correlationId, "getRetryByIds");
        this._persistence.getByIds(correlationId, collection, ids, (err, retries) => {
            time.endTiming();
            callback(err, retries);
        });
    }

    public deleteRetry(correlationId: string, collection: string, id: string, callback: (err: any) => void): void {
        let time = this.instrument(correlationId, "deleteRetry");
        this._persistence.delete(correlationId, collection, id, (err) => {
            time.endTiming();
            callback(err);
        });
    }

    deleteExpiredRetries(correlationId: string, callback: (err: any) => void) {
        let time = this.instrument(correlationId, "deleteExpiredRetriess");
        this._persistence.deleteExpired(correlationId, (err) => {
            time.endTiming();
            if (err) 
                this._logger.error(correlationId, err, "Failed to execute %s.%s", this.component, "deleteExpiredRetriess");
            callback(err);
        });
    }
}
