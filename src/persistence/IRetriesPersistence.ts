import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';

import { RetryV1 } from '../data/version1';

export interface IRetriesPersistence {

    getCollectionNames(correlationId: string, callback: (err: any, items: Array<string>) => void): void;
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<RetryV1>) => void): void;
    create(correlationId: string, retry: RetryV1,
        callback: (err: any, retry: RetryV1) => void): void;
    update(correlationId: string, retry: RetryV1,
        callback: (err: any, retry: RetryV1) => void): void;
    getByIds(correlationId: string, collection: string, ids: string[],
        callback: (err: any, retries: Array<RetryV1>) => void): void;
    getById(correlationId: string, collection: string, id: string,
        callback: (err: any, retry: RetryV1) => void): void;
    delete(correlationId: string, collection: string, id: string, callback: (err: any) => void): void;
    deleteExpired(correlationId: string, callback: (err: any) => void): void;
    clear(correlationId: string, callback: (err: any) => void): void;
}
