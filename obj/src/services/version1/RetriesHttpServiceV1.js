"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_rpc_node_1 = require("pip-services3-rpc-node");
class RetriesHttpServiceV1 extends pip_services3_rpc_node_1.CommandableHttpService {
    constructor() {
        super('v1/retries');
        this._dependencyResolver.put('controller', new pip_services3_commons_node_1.Descriptor('pip-services-retries', 'controller', 'default', '*', '1.0'));
    }
}
exports.RetriesHttpServiceV1 = RetriesHttpServiceV1;
//# sourceMappingURL=RetriesHttpServiceV1.js.map