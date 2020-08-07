"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_data_node_1 = require("pip-services3-data-node");
class RetriesMemoryPersistence extends pip_services3_data_node_1.IdentifiableMemoryPersistence {
    constructor() {
        super();
    }
    getByIds(correlationId, group, ids, callback) {
        let filter = (item) => {
            return _.indexOf(ids, item.id) >= 0 && item.group == group;
        };
        this.getListByFilter(correlationId, filter, null, null, callback);
    }
    getById(correlationId, group, id, callback) {
        let items = this._items.filter(x => x.group == group && x.id == id);
        let item = items.length > 0 ? items[0] : null;
        if (item)
            this._logger.trace(correlationId, "Found retry with id %s", id);
        else
            this._logger.trace(correlationId, "Cannot find retry with id %s", id);
        callback(null, item);
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getGroupNames(correlationId, callback) {
        let result = new Array();
        for (let retry of this._items) {
            if (result.indexOf(retry.group) < 0)
                result.push(retry.group);
        }
        callback(null, result);
    }
    delete(correlationId, group, id, callback) {
        for (let index = this._items.length - 1; index >= 0; index--) {
            let mapping = this._items[index];
            if (mapping.group == group && mapping.id == id) {
                this._items.splice(index, 1);
                break;
            }
        }
        callback(null);
    }
    deleteExpired(correlationId, callback) {
        let now = new Date();
        for (let index = this._items.length - 1; index >= 0; index--) {
            if (this._items[index].expiration_time <= now) {
                this._items.splice(index, 1);
            }
        }
        callback(null);
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
exports.RetriesMemoryPersistence = RetriesMemoryPersistence;
//# sourceMappingURL=RetriesMemoryPersistence.js.map