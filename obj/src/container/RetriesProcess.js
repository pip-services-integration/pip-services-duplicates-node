"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_container_node_1 = require("pip-services3-container-node");
const build_1 = require("../build");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class RetriesProcess extends pip_services3_container_node_1.ProcessContainer {
    constructor() {
        super("retries", "Retries microservice");
        this._factories.add(new build_1.RetriesServiceFactory);
        this._factories.add(new pip_services3_rpc_node_1.DefaultRpcFactory);
    }
}
exports.RetriesProcess = RetriesProcess;
//# sourceMappingURL=RetriesProcess.js.map