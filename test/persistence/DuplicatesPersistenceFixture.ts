// let _ = require('lodash');
// let async = require('async');
// let assert = require('chai').assert;

// import { FilterParams } from 'pip-services3-commons-node';
// import { PagingParams } from 'pip-services3-commons-node';

// import { DuplicateV1 } from '../../src/data/version1/DuplicateV1';
// import { DuplicateTypeV1 } from '../../src/data/version1/DuplicateTypeV1';
// import { DuplicateStateV1 } from '../../src/data/version1/DuplicateStateV1';

// import { IDuplicatesPersistence } from '../../src/persistence/IDuplicatesPersistence';
// import { RatingV1 } from '../../src/data/version1/RatingV1';

// let DUPLICATE1: DuplicateV1 = {
//     id: '1',
//     customer_id: '1',
//     type: DuplicateTypeV1.Visa,
//     number: '4032036094894795',
//     expire_month: 1,
//     expire_year: 2021,
//     first_name: 'Bill',
//     last_name: 'Gates',
//     billing_address: {
//         line1: '2345 Swan Rd',
//         city: 'Tucson',
//         state: 'AZ',
//         postal_code: '85710',
//         country_code: 'US'
//     },
//     ccv: '213',
//     name: 'Test Duplicate 1',
//     saved: true,
//     default: true,
//     state: DuplicateStateV1.Ok
// };
// let DUPLICATE2: DuplicateV1 = {
//     id: '2',
//     customer_id: '1',
//     type: DuplicateTypeV1.Visa,
//     number: '4032037578262780',
//     expire_month: 4,
//     expire_year: 2028,
//     first_name: 'Joe',
//     last_name: 'Dow',
//     billing_address: {
//         line1: '123 Broadway Blvd',
//         city: 'New York',
//         state: 'NY',
//         postal_code: '123001',
//         country_code: 'US'
//     },
//     name: 'Test Duplicate 2',
//     saved: true,
//     default: false,
//     state: DuplicateStateV1.Expired
// };
// let DUPLICATE3: DuplicateV1 = {
//     id: '3',
//     customer_id: '2',
//     type: DuplicateTypeV1.Visa,
//     number: '4032037578262780',
//     expire_month: 5,
//     expire_year: 2022,
//     first_name: 'Steve',
//     last_name: 'Jobs',
//     billing_address: {
//         line1: '234 6th Str',
//         city: 'Los Angeles',
//         state: 'CA',
//         postal_code: '65320',
//         country_code: 'US'
//     },
//     ccv: '124',
//     name: 'Test Duplicate 2',
//     state: DuplicateStateV1.Ok
// };

// export class DuplicatesPersistenceFixture {
//     private _persistence: IDuplicatesPersistence;
    
//     constructor(persistence) {
//         assert.isNotNull(persistence);
//         this._persistence = persistence;
//     }

//     private testCreateDuplicates(done) {
//         async.series([
//         // Create one Duplicate
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     DUPLICATE1,
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isObject(duplicate);
//                         assert.equal(duplicate.first_name, DUPLICATE1.first_name);
//                         assert.equal(duplicate.last_name, DUPLICATE1.last_name);
//                         assert.equal(duplicate.expire_year, DUPLICATE1.expire_year);
//                         assert.equal(duplicate.customer_id, DUPLICATE1.customer_id);

//                         callback();
//                     }
//                 );
//             },
//         // Create another Duplicate
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     DUPLICATE2,
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isObject(duplicate);
//                         assert.equal(duplicate.first_name, DUPLICATE2.first_name);
//                         assert.equal(duplicate.last_name, DUPLICATE2.last_name);
//                         assert.equal(duplicate.expire_year, DUPLICATE2.expire_year);
//                         assert.equal(duplicate.customer_id, DUPLICATE2.customer_id);

//                         callback();
//                     }
//                 );
//             },
//         // Create yet another Duplicate
//             (callback) => {
//                 this._persistence.create(
//                     null,
//                     DUPLICATE3,
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isObject(duplicate);
//                         assert.equal(duplicate.first_name, DUPLICATE3.first_name);
//                         assert.equal(duplicate.last_name, DUPLICATE3.last_name);
//                         assert.equal(duplicate.expire_year, DUPLICATE3.expire_year);
//                         assert.equal(duplicate.customer_id, DUPLICATE3.customer_id);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     }
                
//     testCrudOperations(done) {
//         let duplicate1: DuplicateV1;

//         async.series([
//         // Create items
//             (callback) => {
//                 this.testCreateDuplicates(callback);
//             },
//         // Get all Duplicates
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     new FilterParams(),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 3);

//                         duplicate1 = page.data[0];

//                         callback();
//                     }
//                 );
//             },
//         // Update the Duplicate
//             (callback) => {
//                 duplicate1.name = 'Updated Duplicate 1';

//                 this._persistence.update(
//                     null,
//                     duplicate1,
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isObject(duplicate);
//                         assert.equal(duplicate.name, 'Updated Duplicate 1');
//                         // PayPal changes id on update
//                         //!!assert.equal(duplicate.id, duplicate1.id);

//                         duplicate1 = duplicate;

//                         callback();
//                     }
//                 );
//             },
//         // Delete Duplicate
//             (callback) => {
//                 this._persistence.deleteById(
//                     null,
//                     duplicate1.id,
//                     (err) => {
//                         assert.isNull(err);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete Duplicate
//             (callback) => {
//                 this._persistence.getOneById(
//                     null,
//                     duplicate1.id,
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isNull(duplicate || null);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     }

//     testGetWithFilter(done) {
//         async.series([
//         // Create Duplicates
//             (callback) => {
//                 this.testCreateDuplicates(callback);
//             },
//         // Get Duplicates filtered by customer id
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         customer_id: '1'
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get Duplicates by state
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         state: 'ok'
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         // PayPal calculate states by itself
//                         //assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get Duplicates by saved
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         saved: true
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Get Duplicates by ids
//             (callback) => {
//                 this._persistence.getPageByFilter(
//                     null,
//                     FilterParams.fromValue({
//                         ids: ['1', '3']
//                     }),
//                     new PagingParams(),
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         // PayPal manages ids by itself
//                         //assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         ], done);
//     }

// }
