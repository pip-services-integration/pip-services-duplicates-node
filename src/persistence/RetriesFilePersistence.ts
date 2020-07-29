import { ConfigParams } from 'pip-services3-commons-node';
import { JsonFilePersister } from 'pip-services3-data-node';

import { RetriesMemoryPersistence } from './RetriesMemoryPersistence';
import { RetryV1 } from '../data/version1';

export class RetriesFilePersistence extends RetriesMemoryPersistence {
    protected _persister: JsonFilePersister<RetryV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<RetryV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}