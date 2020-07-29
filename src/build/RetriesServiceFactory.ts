import { Factory } from 'pip-services3-components-node';
import { Descriptor } from 'pip-services3-commons-node';

import { RetriesMongoDbPersistence } from '../persistence';
import { RetriesFilePersistence } from '../persistence';
import { RetriesMemoryPersistence } from '../persistence';
import { RetriesController } from '../logic';
import { RetriesHttpServiceV1 } from '../services/version1';
import {RetryProcessor} from "../logic/RetriesProcessor";

export class RetriesServiceFactory extends Factory {
	public static Descriptor = new Descriptor("pip-services-retries", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("pip-services-retries", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("pip-services-retries", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("pip-services-retries", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("pip-services-retries", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("pip-services-retries", "service", "http", "*", "1.0");
	public static ProcessorDescriptor = new Descriptor("pip-services-retries", "processor", "default", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(RetriesServiceFactory.MemoryPersistenceDescriptor, RetriesMemoryPersistence);
		this.registerAsType(RetriesServiceFactory.FilePersistenceDescriptor, RetriesFilePersistence);
		this.registerAsType(RetriesServiceFactory.MongoDbPersistenceDescriptor, RetriesMongoDbPersistence);
		this.registerAsType(RetriesServiceFactory.ControllerDescriptor, RetriesController);
		this.registerAsType(RetriesServiceFactory.HttpServiceDescriptor, RetriesHttpServiceV1);
		this.registerAsType(RetriesServiceFactory.ProcessorDescriptor, RetryProcessor);
		
	}
}