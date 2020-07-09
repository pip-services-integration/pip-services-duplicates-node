// let _ = require('lodash');
// let async = require('async');
// let assert = require('chai').assert;

// import { Descriptor } from 'pip-services3-commons-node';
// import { ConfigParams } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';
// import { ConsoleLogger } from 'pip-services3-components-node';

// import { DuplicateV1 } from '../../src/data/version1/DuplicateV1';
// import { DuplicateTypeV1 } from '../../src/data/version1/DuplicateTypeV1';
// import { DuplicateStateV1 } from '../../src/data/version1/DuplicateStateV1';
// import { DuplicatesMemoryPersistence } from '../../src/persistence/DuplicatesMemoryPersistence';
// import { DuplicatesController } from '../../src/logic/DuplicatesController';
// import { DuplicatesLambdaFunction } from '../../src/container/DuplicatesLambdaFunction';

// let DUPLICATE1: DuplicateV1 = {
//     id: '1',
//     customer_id: '1',
//     type: DuplicateTypeV1.Visa,
//     number: '1111111111111111',
//     expire_month: 1,
//     expire_year: 2021,
//     first_name: 'Bill',
//     last_name: 'Gates',
//     billing_address: {
//         line1: '2345 Swan Rd',
//         city: 'Tucson',
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
//     number: '2222222222222222',
//     expire_month: 4,
//     expire_year: 2028,
//     first_name: 'Joe',
//     last_name: 'Dow',
//     billing_address: {
//         line1: '123 Broadway Blvd',
//         city: 'New York',
//         postal_code: '123001',
//         country_code: 'US'
//     },
//     name: 'Test Duplicate 2',
//     saved: true,
//     default: false,
//     state: DuplicateStateV1.Expired
// };

// suite('DuplicatesLambdaFunction', ()=> {
//     let lambda: DuplicatesLambdaFunction;

//     suiteSetup((done) => {
//         let config = ConfigParams.fromTuples(
//             'logger.descriptor', 'pip-services:logger:console:default:1.0',
//             'persistence.descriptor', 'pip-services-duplicates:persistence:memory:default:1.0',
//             'controller.descriptor', 'pip-services-duplicates:controller:default:default:1.0'
//         );

//         lambda = new DuplicatesLambdaFunction();
//         lambda.configure(config);
//         lambda.open(null, done);
//     });
    
//     suiteTeardown((done) => {
//         lambda.close(null, done);
//     });
    
//     test('CRUD Operations', (done) => {
//         var duplicate1, duplicate2: DuplicateV1;

//         async.series([
//         // Create one Duplicate
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'duplicates',
//                         cmd: 'create_duplicate',
//                         duplicate: DUPLICATE1
//                     },
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isObject(duplicate);
//                         assert.equal(duplicate.number, DUPLICATE1.number);
//                         assert.equal(duplicate.expire_year, DUPLICATE1.expire_year);
//                         assert.equal(duplicate.customer_id, DUPLICATE1.customer_id);

//                         duplicate1 = duplicate;

//                         callback();
//                     }
//                 );
//             },
//         // Create another Duplicate
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'duplicates',
//                         cmd: 'create_duplicate',
//                         duplicate: DUPLICATE2
//                     },
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isObject(duplicate);
//                         assert.equal(duplicate.number, DUPLICATE2.number);
//                         assert.equal(duplicate.expire_year, DUPLICATE2.expire_year);
//                         assert.equal(duplicate.customer_id, DUPLICATE2.customer_id);

//                         duplicate2 = duplicate;

//                         callback();
//                     }
//                 );
//             },
//         // Get all Duplicates
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'duplicates',
//                         cmd: 'get_duplicates' 
//                     },
//                     (err, page) => {
//                         assert.isNull(err);

//                         assert.isObject(page);
//                         assert.lengthOf(page.data, 2);

//                         callback();
//                     }
//                 );
//             },
//         // Update the Duplicate
//             (callback) => {
//                 duplicate1.name = 'Updated Duplicate 1';

//                 lambda.act(
//                     {
//                         role: 'duplicates',
//                         cmd: 'update_duplicate',
//                         duplicate: duplicate1
//                     },
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isObject(duplicate);
//                         assert.equal(duplicate.name, 'Updated Duplicate 1');
//                         assert.equal(duplicate.id, DUPLICATE1.id);

//                         duplicate1 = duplicate;

//                         callback();
//                     }
//                 );
//             },
//         // Delete Duplicate
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'duplicates',
//                         cmd: 'delete_duplicate_by_id',
//                         duplicate_id: duplicate1.id,
//                         customer_id: duplicate1.customer_id
//                     },
//                     (err) => {
//                         assert.isNull(err);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete Duplicate
//             (callback) => {
//                 lambda.act(
//                     {
//                         role: 'duplicates',
//                         cmd: 'get_duplicate_by_id',
//                         duplicate_id: duplicate1.id,
//                         customer_id: duplicate1.customer_id
//                     },
//                     (err, duplicate) => {
//                         assert.isNull(err);

//                         assert.isNull(duplicate || null);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     });
// });