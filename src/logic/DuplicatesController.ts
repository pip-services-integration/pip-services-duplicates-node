// let async = require('async');

// import { ConfigParams } from 'pip-services3-commons-node';
// import { IConfigurable } from 'pip-services3-commons-node';
// import { IReferences } from 'pip-services3-commons-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { IReferenceable } from 'pip-services3-commons-node';
// import { DependencyResolver } from 'pip-services3-commons-node';
// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';
// import { DataPage } from 'pip-services3-commons-node';
// import { ICommandable } from 'pip-services3-commons-node';
// import { CommandSet } from 'pip-services3-commons-node';
// import { BadRequestException } from 'pip-services3-commons-node';

// import { DuplicateV1 } from '../data/version1/DuplicateV1';
// import { DuplicateStateV1 } from '../data/version1/DuplicateStateV1';
// import { IDuplicatesPersistence } from '../persistence/IDuplicatesPersistence';
// import { IDuplicatesController } from './IDuplicatesController';
// import { DuplicatesCommandSet } from './DuplicatesCommandSet';
// import { UnauthorizedException } from 'pip-services3-commons-node/obj/src/errors/UnauthorizedException';

// export class DuplicatesController implements  IConfigurable, IReferenceable, ICommandable, IDuplicatesController {
//     private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
//         'dependencies.persistence', 'pip-services-duplicates:persistence:*:*:1.0'
//     );

//     private _dependencyResolver: DependencyResolver = new DependencyResolver(DuplicatesController._defaultConfig);
//     private _persistence: IDuplicatesPersistence;
//     private _commandSet: DuplicatesCommandSet;

//     public configure(config: ConfigParams): void {
//         this._dependencyResolver.configure(config);
//     }

//     public setReferences(references: IReferences): void {
//         this._dependencyResolver.setReferences(references);
//         this._persistence = this._dependencyResolver.getOneRequired<IDuplicatesPersistence>('persistence');
//     }

//     public getCommandSet(): CommandSet {
//         if (this._commandSet == null)
//             this._commandSet = new DuplicatesCommandSet(this);
//         return this._commandSet;
//     }
    
//     public getDuplicates(correlationId: string, filter: FilterParams, paging: PagingParams, 
//         callback: (err: any, page: DataPage<DuplicateV1>) => void): void {
//         this._persistence.getPageByFilter(correlationId, filter, paging, callback);
//     }

//     public getDuplicateById(correlationId: string, id: string, customerId: string,
//         callback: (err: any, duplicate: DuplicateV1) => void): void {
//         this._persistence.getOneById(correlationId, id, (err, duplicate) => {
//             // Do not allow to access duplicate of different customer
//             if (duplicate && duplicate.customer_id != customerId)
//                 duplicate = null;
            
//             callback(err, duplicate);
//         });
//     }

//     public createDuplicate(correlationId: string, duplicate: DuplicateV1, 
//         callback: (err: any, duplicate: DuplicateV1) => void): void {

//         duplicate.state = duplicate.state || DuplicateStateV1.Ok;
//         duplicate.create_time = new Date();
//         duplicate.update_time = new Date();

//         this._persistence.create(correlationId, duplicate, callback);
//     }

//     public updateDuplicate(correlationId: string, duplicate: DuplicateV1, 
//         callback: (err: any, duplicate: DuplicateV1) => void): void {

//         let newDuplicate: DuplicateV1;

//         duplicate.state = duplicate.state || DuplicateStateV1.Ok;
//         duplicate.update_time = new Date();
    
//         async.series([
//             (callback) => {
//                 this._persistence.getOneById(correlationId, duplicate.id, (err, data) => {
//                     if (err == null && data && data.customer_id != duplicate.customer_id) {
//                         err = new BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong Duplicate customer id')
//                             .withDetails('id', duplicate.id)
//                             .withDetails('customer_id', duplicate.customer_id);
//                     }
//                     callback(err);
//                 });
//             },
//             (callback) => {
//                 this._persistence.update(correlationId, duplicate, (err, data) => {
//                     newDuplicate = data;
//                     callback(err);
//                 });
//             }
//         ], (err) => {
//             callback(err, newDuplicate);
//         });
//     }

//     public deleteDuplicateById(correlationId: string, id: string, customerId: string,
//         callback: (err: any, duplicate: DuplicateV1) => void): void {  

//         let oldDuplicate: DuplicateV1;

//         async.series([
//             (callback) => {
//                 this._persistence.getOneById(correlationId, id, (err, data) => {
//                     if (err == null && data && data.customer_id != customerId) {
//                         err = new BadRequestException(correlationId, 'WRONG_CUST_ID', 'Wrong Duplicate customer id')
//                             .withDetails('id', id)
//                             .withDetails('customer_id', customerId);
//                     }
//                     callback(err);
//                 });
//             },
//             (callback) => {
//                 this._persistence.deleteById(correlationId, id, (err, data) => {
//                     oldDuplicate = data;
//                     callback(err);
//                 });
//             }
//         ], (err) => {
//             if (callback) callback(err, oldDuplicate);
//         });
//     }

// }
