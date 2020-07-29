import { ProcessContainer } from 'pip-services3-container-node';

import { RetriesServiceFactory } from '../build';
import { DefaultRpcFactory } from 'pip-services3-rpc-node';

export class RetriesProcess extends ProcessContainer {
    public constructor() {
        super("retries", "Retries microservice");
        this._factories.add(new RetriesServiceFactory);
        this._factories.add(new DefaultRpcFactory);
    }
}