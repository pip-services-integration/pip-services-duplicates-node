import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { RetryV1 } from '../data/version1';
export interface IRetriesController {
    getCollectionNames(correlationId: string, callback: (err: any, items: Array<string>) => void): any;
    getRetries(correlationId: string, filter: FilterParams, paging: PagingParams, callback: (err: any, page: DataPage<RetryV1>) => void): void;
    addRetry(correlationId: string, collection: string, id: string, timeToLive: number, callback: (err: any, retry: RetryV1) => void): any;
    addRetries(correlationId: string, collection: string, ids: string[], timeToLive: number, callback: (err: any, retry: RetryV1[]) => void): any;
    getRetryById(correlationId: string, collection: string, id: string, callback: (err: any, retry: RetryV1) => void): void;
    getRetryByIds(correlationId: string, collection: string, ids: string[], callback: (err: any, retry: RetryV1[]) => void): void;
    deleteRetry(correlationId: string, collection: string, id: string, callback: (err: any) => void): void;
    deleteExpiredRetries(correlationId: string, callback: (err: any) => void): any;
}
