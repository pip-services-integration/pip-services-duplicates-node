// import { Factory } from 'pip-services3-components-node';
// import { Descriptor } from 'pip-services3-commons-node';

// import { DuplicatesMongoDbPersistence } from '../persistence/DuplicatesMongoDbPersistence';
// import { DuplicatesFilePersistence } from '../persistence/DuplicatesFilePersistence';
// import { DuplicatesMemoryPersistence } from '../persistence/DuplicatesMemoryPersistence';
// import { DuplicatesController } from '../logic/DuplicatesController';
// import { DuplicatesHttpServiceV1 } from '../services/version1/DuplicatesHttpServiceV1';

// export class DuplicatesServiceFactory extends Factory {
// 	public static Descriptor = new Descriptor("pip-services-duplicates", "factory", "default", "default", "1.0");
// 	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-duplicates", "persistence", "memory", "*", "1.0");
// 	public static FilePersistenceDescriptor = new Descriptor("pip-services-duplicates", "persistence", "file", "*", "1.0");
// 	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-duplicates", "persistence", "mongodb", "*", "1.0");
// 	public static ControllerDescriptor = new Descriptor("pip-services-duplicates", "controller", "default", "*", "1.0");
// 	public static HttpServiceDescriptor = new Descriptor("pip-services-duplicates", "service", "http", "*", "1.0");
	
// 	constructor() {
// 		super();
// 		this.registerAsType(DuplicatesServiceFactory.MemoryPersistenceDescriptor, DuplicatesMemoryPersistence);
// 		this.registerAsType(DuplicatesServiceFactory.FilePersistenceDescriptor, DuplicatesFilePersistence);
// 		this.registerAsType(DuplicatesServiceFactory.MongoDbPersistenceDescriptor, DuplicatesMongoDbPersistence);
// 		this.registerAsType(DuplicatesServiceFactory.ControllerDescriptor, DuplicatesController);
// 		this.registerAsType(DuplicatesServiceFactory.HttpServiceDescriptor, DuplicatesHttpServiceV1);
// 	}
	
// }
