"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_components_node_1 = require("pip-services3-components-node");
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const persistence_1 = require("../persistence");
const persistence_2 = require("../persistence");
const persistence_3 = require("../persistence");
const logic_1 = require("../logic");
const version1_1 = require("../services/version1");
const RetriesProcessor_1 = require("../logic/RetriesProcessor");
class RetriesServiceFactory extends pip_services3_components_node_1.Factory {
    constructor() {
        super();
        this.registerAsType(RetriesServiceFactory.MemoryPersistenceDescriptor, persistence_3.RetriesMemoryPersistence);
        this.registerAsType(RetriesServiceFactory.FilePersistenceDescriptor, persistence_2.RetriesFilePersistence);
        this.registerAsType(RetriesServiceFactory.MongoDbPersistenceDescriptor, persistence_1.RetriesMongoDbPersistence);
        this.registerAsType(RetriesServiceFactory.ControllerDescriptor, logic_1.RetriesController);
        this.registerAsType(RetriesServiceFactory.HttpServiceDescriptor, version1_1.RetriesHttpServiceV1);
        this.registerAsType(RetriesServiceFactory.ProcessorDescriptor, RetriesProcessor_1.RetryProcessor);
    }
}
exports.RetriesServiceFactory = RetriesServiceFactory;
RetriesServiceFactory.Descriptor = new pip_services3_commons_node_1.Descriptor("pip-services-retries", "factory", "default", "default", "1.0");
RetriesServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-retries", "persistence", "memory", "*", "1.0");
RetriesServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-retries", "persistence", "file", "*", "1.0");
RetriesServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-retries", "persistence", "mongodb", "*", "1.0");
RetriesServiceFactory.ControllerDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-retries", "controller", "default", "*", "1.0");
RetriesServiceFactory.HttpServiceDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-retries", "service", "http", "*", "1.0");
RetriesServiceFactory.ProcessorDescriptor = new pip_services3_commons_node_1.Descriptor("pip-services-retries", "processor", "default", "*", "1.0");
//# sourceMappingURL=RetriesServiceFactory.js.map