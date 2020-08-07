import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';

import { RetryV1 } from '../data/version1';

export interface IRetriesController {
    getGroupNames(correlationId: string, callback: (err: any, items: Array<string>) => void);
    getRetries(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<RetryV1>) => void): void;
    addRetry(correlationId: string, group: string, id: string, timeToLive: number, callback: (err: any, retry: RetryV1) => void);
    addRetries(correlationId: string, group: string, ids: string[], timeToLive: number, callback: (err: any, retry: RetryV1[]) => void);
    getRetryById(correlationId: string, group: string, id: string, callback: (err: any, retry: RetryV1) => void): void;
    getRetryByIds(correlationId: string, group: string, ids: string[], callback: (err: any, retry: RetryV1[]) => void): void;
    deleteRetry(correlationId: string, group: string, id: string, callback: (err: any) => void): void;
    deleteExpiredRetries(correlationId: string, callback: (err: any) => void);
}
