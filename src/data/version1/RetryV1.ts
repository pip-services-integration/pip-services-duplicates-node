import { IStringIdentifiable } from 'pip-services3-commons-node';

export class RetryV1 implements IStringIdentifiable {
    public id: string;
    public group: string;
    public attempt_count: number;
    public last_attempt_time: Date;
    public expiration_time: Date;
}