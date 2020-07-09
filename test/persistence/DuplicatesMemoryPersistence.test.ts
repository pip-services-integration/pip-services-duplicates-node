// import { ConfigParams } from 'pip-services3-commons-node';

// import { DuplicatesMemoryPersistence } from '../../src/persistence/DuplicatesMemoryPersistence';
// import { DuplicatesPersistenceFixture } from './DuplicatesPersistenceFixture';

// suite('DuplicatesMemoryPersistence', ()=> {
//     let persistence: DuplicatesMemoryPersistence;
//     let fixture: DuplicatesPersistenceFixture;
    
//     setup((done) => {
//         persistence = new DuplicatesMemoryPersistence();
//         persistence.configure(new ConfigParams());
        
//         fixture = new DuplicatesPersistenceFixture(persistence);
        
//         persistence.open(null, done);
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