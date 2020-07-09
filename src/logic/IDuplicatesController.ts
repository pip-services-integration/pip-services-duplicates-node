import { DataPage } from 'pip-services3-commons-node';
import { FilterParams } from 'pip-services3-commons-node';
import { PagingParams } from 'pip-services3-commons-node';
import { SortParams } from 'pip-services3-commons-node';

import { DuplicateV1 } from '../data/version1/DuplicateV1';
import { RatingV1 } from '../data/version1/DuplicateV1';

export interface IDuplicatesController {
    getDuplicates(correlationId: string, filter: FilterParams, paging: PagingParams, sorting: SortParams,
        callback: (err: any, page: DataPage<DuplicateV1>) => void): void;

    getDuplicateById(correlationId: string, duplicate_id: string,
        callback: (err: any, duplicate: DuplicateV1) => void): void;

    getPartyDuplicate(correlationId: string, party_id: string, product_id: string,
        callback: (err: any, duplicate: DuplicateV1) => void): void;

    getProductRating(correlationId: string, product_id: string,
        callback: (err: any, rating: RatingV1) => void): void;
        
    submitDuplicate(correlationId: string, duplicate: DuplicateV1, 
        callback: (err: any, rating: RatingV1) => void): void;

    reportHelpful(correlationId: string, duplicate_id: string, party_id: string,
        callback: (err: any, duplicate: DuplicateV1) => void): void;

    reportAbuse(correlationId: string, duplicate_id: string, party_id: string,
        callback: (err: any, duplicate: DuplicateV1) => void): void;
            
    deleteDuplicateById(correlationId: string, duplicate_id: string,
        callback: (err: any, rating: RatingV1) => void): void;
}
