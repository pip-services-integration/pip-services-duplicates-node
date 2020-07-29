import { ObjectSchema } from 'pip-services3-commons-node';
import { TypeCode } from 'pip-services3-commons-node';

export class RetryV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withOptionalProperty('id', TypeCode.String);
        this.withOptionalProperty('collection', TypeCode.String);
        this.withOptionalProperty('attempt_count', TypeCode.Long);
        this.withOptionalProperty('last_attempt_time', TypeCode.DateTime);
        this.withOptionalProperty('expiration_time', TypeCode.DateTime);
    }
}