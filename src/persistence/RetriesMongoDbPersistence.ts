let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';

import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from './IRetriesPersistence';

export class RetriesMongoDbPersistence
    extends IdentifiableMongoDbPersistence<RetryV1, string>
    implements IRetriesPersistence {

    constructor() {
        super('retries');
        super.ensureIndex({ customer_id: 1 });
    }

    public getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void): void {
        this._collection.aggregate([
            {
                "$group": { _id: "$collection", count: { $sum: 1 } }
            }
        ]).toArray((err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            let items: Array<string> = [];
            for (let item of results) {
                items.push(item._id);
            }
            callback(null, items);
        })
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<RetryV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getByIds(correlationId: string, collection: string, ids: string[], callback: (err: any, retries: RetryV1[]) => void): void {
        let filter = [];
        filter.push({ collection: collection });
        filter.push({ _id: { $in: ids } });

        super.getListByFilter(correlationId, { $and: filter }, null, null, (err, items) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, items.length > 0 ? items : null);
        })
    }

    public getById(correlationId: string, collection: string, id: string, callback: (err: any, retry: RetryV1) => void): void {
        let filter = [];
        filter.push({ collection: collection });
        filter.push({ _id: id });

        this._collection.findOne({ $and: filter }, (err, item) => {
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with id = %s", collection, id);
            else
                this._logger.trace(correlationId, "Retrieved from %s with id = %s", collection, id);

            item = this.convertToPublic(item);
            callback(err, item);
        });
    }

    public delete(correlationId: string, collection: string, id: string, callback: (err: any) => void): void {
        let filter = [];
        filter.push({ collection: collection });
        filter.push({ _id: id });
        super.deleteByFilter(correlationId, { $and: filter }, callback);
    }

    public deleteExpired(correlationId: string, callback: (err: any) => void): void {
        let now = new Date();
        let filter = { expiration_time: { $lte: now } };
        super.deleteByFilter(correlationId, filter, callback);
    }

    private composeFilter(filter: any) {
        filter = filter || new FilterParams();
        let criteria = [];
        let id = filter.getAsNullableString('id');
        if (id != null)
            criteria.push({ _id: id });

        // Filter ids
        let ids = filter.getAsObject('ids');
        if (_.isString(ids))
            ids = ids.split(',');
        if (_.isArray(ids))
            criteria.push({ _id: { $in: ids } });

        let collection = filter.getAsNullableString('collection');
        if (collection != null)
            criteria.push({ collection: collection });

        let attemptCount = filter.getAsNullableString('attempt_count');
        if (attemptCount != null)
            criteria.push({ attempt_count: attemptCount });

        let lastAttemptTime = filter.getAsNullableBoolean('last_attempt_time');
        if (lastAttemptTime != null)
            criteria.push({ last_attempt_time: lastAttemptTime });

        return criteria.length > 0 ? { $and: criteria } : null;
    }
}
