// import { CommandSet } from 'pip-services3-commons-node';
// import { ICommand } from 'pip-services3-commons-node';
// import { Command } from 'pip-services3-commons-node';
// import { Schema } from 'pip-services3-commons-node';
// import { Parameters } from 'pip-services3-commons-node';
// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';
// import { ObjectSchema } from 'pip-services3-commons-node';
// import { TypeCode } from 'pip-services3-commons-node';
// import { FilterParamsSchema } from 'pip-services3-commons-node';
// import { PagingParamsSchema } from 'pip-services3-commons-node';

// import { DuplicateV1 } from '../data/version1/DuplicateV1';
// import { DuplicateV1Schema } from '../data/version1/DuplicateV1Schema';
// import { IDuplicatesController } from './IDuplicatesController';

// export class DuplicatesCommandSet extends CommandSet {
//     private _logic: IDuplicatesController;

//     constructor(logic: IDuplicatesController) {
//         super();

//         this._logic = logic;

//         // Register commands to the database
// 		this.addCommand(this.makeGetDuplicatesCommand());
// 		this.addCommand(this.makeGetDuplicateByIdCommand());
// 		this.addCommand(this.makeCreateDuplicateCommand());
// 		this.addCommand(this.makeUpdateDuplicateCommand());
// 		this.addCommand(this.makeDeleteDuplicateByIdCommand());
//     }

// 	private makeGetDuplicatesCommand(): ICommand {
// 		return new Command(
// 			"get_duplicates",
// 			new ObjectSchema(true)
// 				.withOptionalProperty('filter', new FilterParamsSchema())
// 				.withOptionalProperty('paging', new PagingParamsSchema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let filter = FilterParams.fromValue(args.get("filter"));
//                 let paging = PagingParams.fromValue(args.get("paging"));
//                 this._logic.getDuplicates(correlationId, filter, paging, callback);
//             }
// 		);
// 	}

// 	private makeGetDuplicateByIdCommand(): ICommand {
// 		return new Command(
// 			"get_duplicate_by_id",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('duplicate_id', TypeCode.String)
// 				.withRequiredProperty('customer_id', TypeCode.String),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let duplicateId = args.getAsString("duplicate_id");
//                 let customerId = args.getAsString("customer_id");
//                 this._logic.getDuplicateById(correlationId, duplicateId, customerId, callback);
//             }
// 		);
// 	}

// 	private makeCreateDuplicateCommand(): ICommand {
// 		return new Command(
// 			"create_duplicate",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('duplicate', new DuplicateV1Schema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let duplicate = args.get("duplicate");
//                 this._logic.createDuplicate(correlationId, duplicate, callback);
//             }
// 		);
// 	}

// 	private makeUpdateDuplicateCommand(): ICommand {
// 		return new Command(
// 			"update_duplicate",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('duplicate', new DuplicateV1Schema()),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let duplicate = args.get("duplicate");
//                 this._logic.updateDuplicate(correlationId, duplicate, callback);
//             }
// 		);
// 	}
	
// 	private makeDeleteDuplicateByIdCommand(): ICommand {
// 		return new Command(
// 			"delete_duplicate_by_id",
// 			new ObjectSchema(true)
// 				.withRequiredProperty('duplicate_id', TypeCode.String)
// 				.withRequiredProperty('customer_id', TypeCode.String),
//             (correlationId: string, args: Parameters, callback: (err: any, result: any) => void) => {
//                 let duplicateId = args.getAsNullableString("duplicate_id");
//                 let customerId = args.getAsString("customer_id");
//                 this._logic.deleteDuplicateById(correlationId, duplicateId, customerId, callback);
// 			}
// 		);
// 	}

// }