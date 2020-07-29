import { Descriptor } from 'pip-services3-commons-node';
import { CommandableHttpService } from 'pip-services3-rpc-node';

export class RetriesHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/retries');
        this._dependencyResolver.put('controller', new Descriptor('pip-services-retries', 'controller', 'default', '*', '1.0'));
    }
}