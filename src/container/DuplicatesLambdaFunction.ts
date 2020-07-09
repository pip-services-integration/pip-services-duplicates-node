// import { Descriptor } from 'pip-services3-commons-node';
// import { CommandableLambdaFunction } from 'pip-services3-aws-node';
// import { DuplicatesServiceFactory } from '../build/DuplicatesServiceFactory';

// export class DuplicatesLambdaFunction extends CommandableLambdaFunction {
//     public constructor() {
//         super("duplicates", "Duplicates function");
//         this._dependencyResolver.put('controller', new Descriptor('pip-services-duplicates', 'controller', 'default', '*', '*'));
//         this._factories.add(new DuplicatesServiceFactory());
//     }
// }

// export const handler = new DuplicatesLambdaFunction().getHandler();