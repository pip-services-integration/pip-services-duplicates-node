import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-node';
import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from './IRetriesPersistence';
export declare class RetriesMongoDbPersistence extends IdentifiableMongoDbPersistence<RetryV1, string> implements IRetriesPersistence {
    constructor();
    getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<RetryV1>) => void): void;
    getByIds(correlationId: string, collection: string, ids: string[], callback: (err: any, retries: RetryV1[]) => void): void;
    getById(correlationId: string, collection: string, id: string, callback: (err: any, retry: RetryV1) => void): void;
    delete(correlationId: string, collection: string, id: string, callback: (err: any) => void): void;
    deleteExpired(correlationId: string, callback: (err: any) => void): void;
    private composeFilter;
}
