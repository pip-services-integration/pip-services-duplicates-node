import { IStringIdentifiable } from 'pip-services3-commons-node';
export declare class RetryV1 implements IStringIdentifiable {
    id: string;
    group: string;
    attempt_count: number;
    last_attempt_time: Date;
    expiration_time: Date;
}
