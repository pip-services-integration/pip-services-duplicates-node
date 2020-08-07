"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_commons_node_2 = require("pip-services3-commons-node");
const pip_services3_commons_node_3 = require("pip-services3-commons-node");
const pip_services3_commons_node_4 = require("pip-services3-commons-node");
const pip_services3_commons_node_5 = require("pip-services3-commons-node");
const pip_services3_commons_node_6 = require("pip-services3-commons-node");
const pip_services3_commons_node_7 = require("pip-services3-commons-node");
const pip_services3_commons_node_8 = require("pip-services3-commons-node");
class RetriesCommandSet extends pip_services3_commons_node_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        // Register commands to the database
        this.addCommand(this.makeGetGroupNamesCommand());
        this.addCommand(this.makeGetRetriesCommand());
        this.addCommand(this.makeAddRetryCommand());
        this.addCommand(this.makeAddRetriesCommand());
        this.addCommand(this.makeGetRetryByIdCommand());
        this.addCommand(this.makeGetRetryByIdsCommand());
        this.addCommand(this.makeDeleteRetryCommand());
        this.addCommand(this.makeDeleteExpiredRetryCommand());
    }
    makeGetGroupNamesCommand() {
        return new pip_services3_commons_node_2.Command("get_group_names", new pip_services3_commons_node_5.ObjectSchema(true), (correlationId, args, callback) => {
            this._logic.getGroupNames(correlationId, callback);
        });
    }
    makeGetRetriesCommand() {
        return new pip_services3_commons_node_2.Command("get_retries", new pip_services3_commons_node_5.ObjectSchema(true)
            .withOptionalProperty('filter', new pip_services3_commons_node_7.FilterParamsSchema())
            .withOptionalProperty('paging', new pip_services3_commons_node_8.PagingParamsSchema()), (correlationId, args, callback) => {
            let filter = pip_services3_commons_node_3.FilterParams.fromValue(args.get("filter"));
            let paging = pip_services3_commons_node_4.PagingParams.fromValue(args.get("paging"));
            this._logic.getRetries(correlationId, filter, paging, callback);
        });
    }
    makeAddRetryCommand() {
        return new pip_services3_commons_node_2.Command("add_retry", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("id", pip_services3_commons_node_6.TypeCode.String)
            .withOptionalProperty("ttl", pip_services3_commons_node_6.TypeCode.Long), (correlationId, args, callback) => {
            var group = args.getAsString("group");
            var id = args.getAsString("id");
            var ttl = args.getAsNullableLong("ttl");
            this._logic.addRetry(correlationId, group, id, ttl, callback);
        });
    }
    makeAddRetriesCommand() {
        return new pip_services3_commons_node_2.Command("add_retries", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("ids", pip_services3_commons_node_6.TypeCode.Array)
            .withOptionalProperty("ttl", pip_services3_commons_node_6.TypeCode.Long), (correlationId, args, callback) => {
            var group = args.getAsString("group");
            var ids = pip_services3_commons_node_1.StringConverter.toStringWithDefault(args.getAsObject("ids"), '').split(',');
            var ttl = args.getAsNullableLong("ttl");
            this._logic.addRetries(correlationId, group, ids, ttl, callback);
        });
    }
    makeGetRetryByIdCommand() {
        return new pip_services3_commons_node_2.Command("get_retry_by_id", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("id", pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            var group = args.getAsString("group");
            var id = args.getAsString("id");
            this._logic.getRetryById(correlationId, group, id, callback);
        });
    }
    makeGetRetryByIdsCommand() {
        return new pip_services3_commons_node_2.Command("get_retry_by_ids", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("ids", pip_services3_commons_node_6.TypeCode.Array), // TODO: Check type
        (correlationId, args, callback) => {
            var group = args.getAsString("group");
            var ids = pip_services3_commons_node_1.StringConverter.toStringWithDefault(args.getAsObject("ids"), '').split(',');
            this._logic.getRetryByIds(correlationId, group, ids, callback);
        });
    }
    makeDeleteRetryCommand() {
        return new pip_services3_commons_node_2.Command("delete_retry", new pip_services3_commons_node_5.ObjectSchema(true)
            .withRequiredProperty("group", pip_services3_commons_node_6.TypeCode.String)
            .withRequiredProperty("id", pip_services3_commons_node_6.TypeCode.String), (correlationId, args, callback) => {
            var group = args.getAsString("group");
            var id = args.getAsString("id");
            this._logic.deleteRetry(correlationId, group, id, (err) => {
                callback(err, null);
            });
        });
    }
    makeDeleteExpiredRetryCommand() {
        return new pip_services3_commons_node_2.Command("delete_expired", new pip_services3_commons_node_5.ObjectSchema(true), (correlationId, args, callback) => {
            this._logic.deleteExpiredRetries(correlationId, (err) => {
                callback(err, null);
            });
        });
    }
}
exports.RetriesCommandSet = RetriesCommandSet;
//# sourceMappingURL=RetriesCommandSet.js.map