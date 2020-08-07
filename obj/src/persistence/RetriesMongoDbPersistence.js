"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let _ = require('lodash');
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_mongodb_node_1 = require("pip-services3-mongodb-node");
class RetriesMongoDbPersistence extends pip_services3_mongodb_node_1.IdentifiableMongoDbPersistence {
    constructor() {
        super('retries');
        super.ensureIndex({ customer_id: 1 });
    }
    getGroupNames(correlationId, callback) {
        this._collection.aggregate([
            {
                "$group": { _id: "$group", count: { $sum: 1 } }
            }
        ]).toArray((err, results) => {
            if (err) {
                callback(err, null);
                return;
            }
            let items = [];
            for (let item of results) {
                items.push(item._id);
            }
            callback(null, items);
        });
    }
    composeFilter(filter) {
        filter = filter || new pip_services3_commons_node_1.FilterParams();
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
        let group = filter.getAsNullableString('group');
        if (group != null)
            criteria.push({ group: group });
        let attemptCount = filter.getAsNullableString('attempt_count');
        if (attemptCount != null)
            criteria.push({ attempt_count: attemptCount });
        let lastAttemptTime = filter.getAsNullableBoolean('last_attempt_time');
        if (lastAttemptTime != null)
            criteria.push({ last_attempt_time: lastAttemptTime });
        return criteria.length > 0 ? { $and: criteria } : null;
    }
    getPageByFilter(correlationId, filter, paging, callback) {
        super.getPageByFilter(correlationId, this.composeFilter(filter), paging, null, null, callback);
    }
    getByIds(correlationId, group, ids, callback) {
        let filter = [];
        filter.push({ group: group });
        filter.push({ _id: { $in: ids } });
        super.getListByFilter(correlationId, { $and: filter }, null, null, (err, items) => {
            if (err) {
                callback(err, null);
                return;
            }
            callback(null, items.length > 0 ? items : null);
        });
    }
    getById(correlationId, group, id, callback) {
        let filter = [];
        filter.push({ group: group });
        filter.push({ _id: id });
        this._collection.findOne({ $and: filter }, (err, item) => {
            if (item == null)
                this._logger.trace(correlationId, "Nothing found from %s with id = %s", group, id);
            else
                this._logger.trace(correlationId, "Retrieved from %s with id = %s", group, id);
            item = this.convertToPublic(item);
            callback(err, item);
        });
    }
    delete(correlationId, group, id, callback) {
        let filter = [];
        filter.push({ group: group });
        filter.push({ _id: id });
        super.deleteByFilter(correlationId, { $and: filter }, callback);
    }
    deleteExpired(correlationId, callback) {
        let now = new Date();
        let filter = { expiration_time: { $lte: now } };
        super.deleteByFilter(correlationId, filter, callback);
    }
}
exports.RetriesMongoDbPersistence = RetriesMongoDbPersistence;
//# sourceMappingURL=RetriesMongoDbPersistence.js.map