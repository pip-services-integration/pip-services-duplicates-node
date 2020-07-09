// let _ = require('lodash');
// let async = require('async');
// let restify = require('restify');
// let assert = require('chai').assert;

// import { ConfigParams } from 'pip-services3-commons-node';
// import { Descriptor } from 'pip-services3-commons-node';
// import { References } from 'pip-services3-commons-node';

// import { DuplicateV1 } from '../../../src/data/version1/DuplicateV1';
// import { DuplicateTypeV1 } from '../../../src/data/version1/DuplicateTypeV1';
// import { DuplicateStateV1 } from '../../../src/data/version1/DuplicateStateV1';
// import { DuplicatesMemoryPersistence } from '../../../src/persistence/DuplicatesMemoryPersistence';
// import { DuplicatesController } from '../../../src/logic/DuplicatesController';
// import { DuplicatesHttpServiceV1 } from '../../../src/services/version1/DuplicatesHttpServiceV1';

// let httpConfig = ConfigParams.fromTuples(
//     "connection.protocol", "http",
//     "connection.host", "localhost",
//     "connection.port", 3000
// );

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


// suite('DuplicatesHttpServiceV1', ()=> {    
//     let service: DuplicatesHttpServiceV1;
//     let rest: any;

//     suiteSetup((done) => {
//         let persistence = new DuplicatesMemoryPersistence();
//         let controller = new DuplicatesController();

//         service = new DuplicatesHttpServiceV1();
//         service.configure(httpConfig);

//         let references: References = References.fromTuples(
//             new Descriptor('pip-services-duplicates', 'persistence', 'memory', 'default', '1.0'), persistence,
//             new Descriptor('pip-services-duplicates', 'controller', 'default', 'default', '1.0'), controller,
//             new Descriptor('pip-services-duplicates', 'service', 'http', 'default', '1.0'), service
//         );
//         controller.setReferences(references);
//         service.setReferences(references);

//         service.open(null, done);
//     });
    
//     suiteTeardown((done) => {
//         service.close(null, done);
//     });

//     setup(() => {
//         let url = 'http://localhost:3000';
//         rest = restify.createJsonClient({ url: url, version: '*' });
//     });
    
    
//     test('CRUD Operations', (done) => {
//         let duplicate1, duplicate2: DuplicateV1;

//         async.series([
//         // Create one Duplicate
//             (callback) => {
//                 rest.post('/v1/duplicates/create_duplicate',
//                     {
//                         duplicate: DUPLICATE1
//                     },
//                     (err, req, res, duplicate) => {
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
//                 rest.post('/v1/duplicates/create_duplicate', 
//                     {
//                         duplicate: DUPLICATE2
//                     },
//                     (err, req, res, duplicate) => {
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
//                 rest.post('/v1/duplicates/get_duplicates',
//                     {},
//                     (err, req, res, page) => {
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

//                 rest.post('/v1/duplicates/update_duplicate',
//                     { 
//                         duplicate: duplicate1
//                     },
//                     (err, req, res, duplicate) => {
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
//                 rest.post('/v1/duplicates/delete_duplicate_by_id',
//                     {
//                         duplicate_id: duplicate1.id,
//                         customer_id: duplicate1.customer_id
//                     },
//                     (err, req, res, result) => {
//                         assert.isNull(err);

//                         //assert.isNull(result);

//                         callback();
//                     }
//                 );
//             },
//         // Try to get delete Duplicate
//             (callback) => {
//                 rest.post('/v1/duplicates/get_duplicate_by_id',
//                     {
//                         duplicate_id: duplicate1.id,
//                         customer_id: duplicate1.customer_id
//                     },
//                     (err, req, res, result) => {
//                         assert.isNull(err);

//                         //assert.isNull(result);

//                         callback();
//                     }
//                 );
//             }
//         ], done);
//     });
// });