import { CommandSet } from 'pip-services3-commons-node';
import { IRetriesController } from './IRetriesController';
export declare class RetriesCommandSet extends CommandSet {
    private _logic;
    constructor(logic: IRetriesController);
    private makeGetCollectionNamesCommand;
    private makeGetRetriesCommand;
    private makeAddRetryCommand;
    private makeAddRetriesCommand;
    private makeGetRetryByIdCommand;
    private makeGetRetryByIdsCommand;
    private makeDeleteRetryCommand;
    private makeDeleteExpiredRetryCommand;
}
