let _ = require('lodash');

import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';

import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from './IRetriesPersistence';

export class RetriesMemoryPersistence
    extends IdentifiableMemoryPersistence<RetryV1, string>
    implements IRetriesPersistence {

    constructor() {
        super();
    }

    public getByIds(correlationId: string, group: string, ids: string[], callback: (err: any, retries: RetryV1[]) => void): void {
        let filter = (item: RetryV1) => {
            return _.indexOf(ids, item.id) >= 0 && item.group == group;
        }
        this.getListByFilter(correlationId, filter, null, null, callback);
    }

    public getById(correlationId: string, group: string, id: string, callback: (err: any, retry: RetryV1) => void): void {
        let items = this._items.filter(x => x.group == group && x.id == id);
        let item = items.length > 0 ? items[0] : null;
        if (item)
            this._logger.trace(correlationId, "Found retry with id %s", id);
        else
            this._logger.trace(correlationId, "Cannot find retry with id %s", id);
        callback(null, item);
    }

    public getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<RetryV1>) => void): void {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }

    public getGroupNames(correlationId: string, callback: (err: any, items: string[]) => void): void {
        let result = new Array<string>();
        for (let retry of this._items) {
            if (result.indexOf(retry.group) < 0)
                result.push(retry.group);
        }
        callback(null, result);
    }

    public delete(correlationId: string, group: string, id: string, callback: (err: any) => void): void {
        for (let index = this._items.length - 1; index >= 0; index--) {
            let mapping = this._items[index];
            if (mapping.group == group && mapping.id == id) {
                this._items.splice(index, 1);
                break;
            }
        }
        callback(null);
    }

    public deleteExpired(correlationId: string, callback: (err: any) => void): void {
        let now: Date = new Date();
        for (let index = this._items.length - 1; index >= 0; index--) {
            if (this._items[index].expiration_time <= now) {
                this._items.splice(index, 1);
            }
        }
        callback(null);
    }

    private composeFilter(filter: FilterParams): any {
        filter = filter || new FilterParams();

        let id = filter.getAsNullableString('id');
        let group = filter.getAsNullableString('group');
        let attempt_count = filter.getAsNullableString('attempt_count');
        let last_attempt_time = filter.getAsNullableBoolean('last_attempt_time');
        let ids = filter.getAsObject('ids');

        // Process ids filter
        if (_.isString(ids))
            ids = ids.split(',');
        if (!_.isArray(ids))
            ids = null;

        return (item) => {
            if (id && item.id != id)
                return false;
            if (ids && _.indexOf(ids, item.id) < 0)
                return false;
            if (group && item.group != group)
                return false;
            if (attempt_count && item.customer_id != attempt_count)
                return false;
            if (last_attempt_time != null && item.saved != last_attempt_time)
                return false;
            return true;
        };
    }
}
