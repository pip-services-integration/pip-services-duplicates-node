import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { DataPage } from 'pip-services3-commons-node';
import { IGetter } from 'pip-services3-data-node';

import { DuplicateV1 } from '../data/version1/DuplicateV1';
import { RatingV1 } from '../data/version1/DuplicateV1';

export interface IDuplicatesPersistence extends IGetter<DuplicateV1, string> {
    getPageByFilter(correlationId: string, filter: FilterParams, paging: PagingParams, 
        callback: (err: any, page: DataPage<DuplicateV1>) => void): void;

    getOneById(correlationId: string, id: string, 
        callback: (err: any, item: DuplicateV1) => void): void;

    set(correlationId: string, item: DuplicateV1, 
        callback: (err: any, rating: RatingV1) => void): void;

    increment(correlationId: string, rating: RatingV1, 
        callback: (err: any, rating: RatingV1) => void): void;

    deleteById(correlationId: string, id: string,
        callback: (err: any, item: DuplicateV1) => void): void;
}
