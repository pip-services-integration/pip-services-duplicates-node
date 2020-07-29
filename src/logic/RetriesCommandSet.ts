import {CommandSet, SortParams, StringConverter} from 'pip-services3-commons-node';
import { ICommand } from 'pip-services3-commons-node';
import { Command } from 'pip-services3-commons-node';
import { Parameters } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';
import { FilterParamsSchema } from 'pip-services3-commons-node';
import { PagingParamsSchema } from 'pip-services3-commons-node';

import { IRetriesController } from './IRetriesController';

export class RetriesCommandSet extends CommandSet {
    private _logic: IRetriesController;

    constructor(logic: IRetriesController) {
        super();

        this._logic = logic;

        // Register commands to the database
		this.addCommand(this.makeGetCollectionNamesCommand());
		this.addCommand(this.makeGetRetriesCommand());
		this.addCommand(this.makeAddRetryCommand());
		this.addCommand(this.makeAddRetriesCommand());
		this.addCommand(this.makeGetRetryByIdCommand());
		this.addCommand(this.makeGetRetryByIdsCommand());
		this.addCommand(this.makeDeleteRetryCommand());
		this.addCommand(this.makeDeleteExpiredRetryCommand());
    }

	private makeGetCollectionNamesCommand(): ICommand {
		return new Command(
			"get_collection_names",
			new ObjectSchema(true),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				this._logic.getCollectionNames(correlationId, callback);
			});
	}
	
	private makeGetRetriesCommand(): ICommand {
		return new Command(
			"get_retries",
			new ObjectSchema(true)
				.withOptionalProperty('filter', new FilterParamsSchema())
				.withOptionalProperty('paging', new PagingParamsSchema()),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                let filter = FilterParams.fromValue(args.get("filter"));
				let paging = PagingParams.fromValue(args.get("paging"));
                this._logic.getRetries(correlationId, filter, paging, callback);
            }
		);
	}

	private makeAddRetryCommand(): ICommand {
		return new Command(
			"add_retry",
			new ObjectSchema(true)
				.withRequiredProperty("collection", TypeCode.String)
				.withRequiredProperty("id", TypeCode.String)
				.withOptionalProperty("ttl", TypeCode.Long),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				var collection = args.getAsString("collection");
				var id = args.getAsString("id");
				var ttl = args.getAsNullableLong("ttl");
				this._logic.addRetry(correlationId, collection, id, ttl, callback);
			}
		);
	}

	private makeAddRetriesCommand(): ICommand {
		return new Command(
			"add_retries",
			new ObjectSchema(true)
				.withRequiredProperty("collection", TypeCode.String)
				.withRequiredProperty("ids", TypeCode.Array)
				.withOptionalProperty("ttl", TypeCode.Long),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				var collection = args.getAsString("collection");
				var ids = StringConverter.toStringWithDefault(args.getAsObject("ids"), '').split(',');
				var ttl = args.getAsNullableLong("ttl");
				this._logic.addRetries(correlationId, collection, ids, ttl, callback);
			}
		);
	}

	private makeGetRetryByIdCommand(): ICommand {
		return new Command(
			"get_retry_by_id",
			new ObjectSchema(true)
				.withRequiredProperty("collection", TypeCode.String)
				.withRequiredProperty("id", TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				var collection = args.getAsString("collection");
				var id = args.getAsString("id");
				this._logic.getRetryById(correlationId, collection, id, callback);
			}
		);
	}
	
	private makeGetRetryByIdsCommand(): ICommand {
		return new Command(
			"get_retry_by_ids",
			new ObjectSchema(true)
				.withRequiredProperty("collection", TypeCode.String)
				.withRequiredProperty("ids", TypeCode.Array), // TODO: Check type
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				var collection = args.getAsString("collection");
				var ids = StringConverter.toStringWithDefault(args.getAsObject("ids"), '').split(',');
				this._logic.getRetryByIds(correlationId, collection, ids, callback);
			}
		);
	}

	private makeDeleteRetryCommand(): ICommand {
		return new Command(
			"delete_retry",
			new ObjectSchema(true)
				.withRequiredProperty("collection", TypeCode.String)
				.withRequiredProperty("id", TypeCode.String),
			(correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
				var collection = args.getAsString("collection");
				var id = args.getAsString("id");
				this._logic.deleteRetry(correlationId, collection, id, (err) => {
					callback(err, null);
				});
			});
	}
	
	private makeDeleteExpiredRetryCommand(): ICommand {
		return new Command(
			"delete_expired",
			new ObjectSchema(true),
            (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
                this._logic.deleteExpiredRetries(correlationId, (err) => {
					callback(err, null);
				});
			}
		);
	}
}