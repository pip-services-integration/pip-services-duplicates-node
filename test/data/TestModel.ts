import { RetryV1 } from "../../src/data/version1/RetryV1";

export class TestModel {
    public static DUPLICATE1: RetryV1 = {
        id: '1',
        group: "c1",
        attempt_count: 1,
        last_attempt_time: new Date(),
        expiration_time: new Date()
    };

    public static DUPLICATE2: RetryV1 = {
        id: '2',
        group: "c2",
        attempt_count: 1,
        last_attempt_time: new Date(),
        expiration_time: new Date()
    };

    public static DUPLICATE3: RetryV1 = {
        id: '3',
        group: "c2",
        attempt_count: 1,
        last_attempt_time: new Date(),
        expiration_time: new Date()
    };
}
