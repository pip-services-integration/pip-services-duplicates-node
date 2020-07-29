import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IdentifiableMemoryPersistence } from 'pip-services3-data-node';
import { RetryV1 } from '../data/version1';
import { IRetriesPersistence } from './IRetriesPersistence';
export declare class RetriesMemoryPersistence extends IdentifiableMemoryPersistence<RetryV1, string> implements IRetriesPersistence {
    constructor();
    getByIds(correlationId: string, collection: string, ids: string[], callback: (err: any, retries: RetryV1[]) => void): void;
    getById(correlationId: string, collection: string, id: string, callback: (err: any, retry: RetryV1) => void): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<RetryV1>) => void): void;
    getCollectionNames(correlationId: string, callback: (err: any, items: string[]) => void): void;
    delete(correlationId: string, collection: string, id: string, callback: (err: any) => void): void;
    deleteExpired(correlationId: string, callback: (err: any) => void): void;
    private composeFilter;
}
