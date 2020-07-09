// import { ConfigParams } from 'pip-services3-commons-node';

// import { DuplicatesFilePersistence } from '../../src/persistence/DuplicatesFilePersistence';
// import { DuplicatesPersistenceFixture } from './DuplicatesPersistenceFixture';

// suite('DuplicatesFilePersistence', ()=> {
//     let persistence: DuplicatesFilePersistence;
//     let fixture: DuplicatesPersistenceFixture;
    
//     setup((done) => {
//         persistence = new DuplicatesFilePersistence('./data/duplicates.test.json');

//         fixture = new DuplicatesPersistenceFixture(persistence);

//         persistence.open(null, (err) => {
//             persistence.clear(null, done);
//         });
//     });
    
//     teardown((done) => {
//         persistence.close(null, done);
//     });
        
//     test('CRUD Operations', (done) => {
//         fixture.testCrudOperations(done);
//     });

//     test('Get with Filters', (done) => {
//         fixture.testGetWithFilter(done);
//     });

// });