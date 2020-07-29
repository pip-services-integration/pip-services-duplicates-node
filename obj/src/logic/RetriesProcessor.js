"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services3_commons_node_1 = require("pip-services3-commons-node");
const pip_services3_components_node_1 = require("pip-services3-components-node");
class RetryProcessor {
    constructor() {
        this._logger = new pip_services3_components_node_1.CompositeLogger();
        this._timer = new pip_services3_commons_node_1.FixedRateTimer();
        this._correlationId = "Integration.Retries";
        this._interval = 300000;
    }
    configure(config) {
        this._logger.configure(config);
        this._interval = config.getAsIntegerWithDefault("options.interval", this._interval);
    }
    setReferences(references) {
        this._logger.setReferences(references);
        this._controller = references.getOneRequired(new pip_services3_commons_node_1.Descriptor("pip-services-retries", "controller", "default", "*", "1.0"));
    }
    open(correlationId, callback) {
        this._timer.setDelay(this._interval);
        this._timer.setInterval(this._interval);
        this._timer.setTask({
            notify: (correlationId, args) => {
                this._deleteExpiredRetries();
            }
        });
        this._timer.start();
        callback(null);
    }
    close(correlationId, callback) {
        this._timer.stop();
        callback(null);
    }
    isOpen() {
        return this._timer != null && this._timer.isStarted();
    }
    _deleteExpiredRetries() {
        this._timer.stop();
        this._logger.info(this._correlationId, "Deleting expired retries...");
        this._controller.deleteExpiredRetries(this._correlationId, (err) => {
            this._logger.info(this._correlationId, "Expired retries deleted.");
            this._timer.start();
        });
    }
}
exports.RetryProcessor = RetryProcessor;
//# sourceMappingURL=RetriesProcessor.js.map