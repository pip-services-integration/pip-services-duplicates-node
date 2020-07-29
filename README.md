# <img src="https://github.com/pip-services/pip-services/raw/master/design/Logo.png" alt="Pip.Services Logo" style="max-width:30%"> <br/> Retries microservice

This is Retries microservice from Pip.Services library. 
It stores Retries 

The microservice currently supports the following deployment options:
* Deployment platforms: Standalone Process, Seneca
* External APIs: HTTP/REST, Seneca
* Persistence: Flat Files, MongoDB

This microservice has no dependencies on other microservices.

<a name="links"></a> Quick Links:

* [Download Links](doc/Downloads.md)
* [Development Guide](doc/Development.md)
* [Configuration Guide](doc/Configuration.md)
* [Deployment Guide](doc/Deployment.md)
* Client SDKs
  - [Node.js SDK](https://github.com/pip-services/pip-clients-retries-node)
* Communication Protocols
  - [HTTP Version 1](doc/HttpProtocolV1.md)

## Contract

Logical contract of the microservice is presented below. For physical implementation (HTTP/REST, Thrift, Seneca, Lambda, etc.),
please, refer to documentation of the specific protocol.

```typescript
class RetryV1 {
    public id: string;
    public collection: string;
    public attempt_count: number;
    public last_attempt_time: Date;
    public expiration_time: Date;
}

interface IRetriesController {
    getCollectionNames(correlationId: string, callback: (err: any, items: Array<string>) => void);

    getRetries(correlationId: string, filter: FilterParams, paging: PagingParams,
        callback: (err: any, page: DataPage<RetryV1>) => void): void;

    addRetry(correlationId: string, collection: string, id: string, timeToLive: number, 
        callback: (err: any, retry: RetryV1) => void);

    addRetries(correlationId: string, collection: string, ids: string[], timeToLive: number, 
        callback: (err: any, retry: RetryV1[]) => void);

    getRetryById(correlationId: string, collection: string, id: string, 
        callback: (err: any, retry: RetryV1) => void): void;

    getRetryByIds(correlationId: string, collection: string, ids: string[], 
        callback: (err: any, retry: RetryV1[]) => void): void;

    deleteRetry(correlationId: string, collection: string, id: string, 
        callback: (err: any) => void): void;

    deleteExpiredRetries(correlationId: string, callback: (err: any) => void);
}
```

## Download

Right now the only way to get the microservice is to check it out directly from github repository
```bash
git clone git@github.com:pip-services-integration/pip-services-retries-node.git
```

Pip.Service team is working to implement packaging and make stable releases available for your 
as zip downloadable archieves.

## Run

Add **config.yml** file to the root of the microservice folder and set configuration parameters.
As the starting point you can use example configuration from **config.example.yml** file. 

Example of microservice configuration
```yaml
- descriptor: "pip-services-container:container-info:default:default:1.0"
  name: "pip-services-retries"
  description: "Retries microservice"

- descriptor: "pip-services-commons:logger:console:default:1.0"
  level: "trace"

- descriptor: "pip-services-retries:persistence:file:default:1.0"
  path: "./data/retries.json"

- descriptor: "pip-services-retries:controller:default:default:1.0"

- descriptor: "pip-services-retries:service:http:default:1.0"
  connection:
    protocol: "http"
    host: "0.0.0.0"
    port: 8080
```
 
For more information on the microservice configuration see [Configuration Guide](Configuration.md).

Start the microservice using the command:
```bash
node run
```

## Use

The easiest way to work with the microservice is to use client SDK. 
The complete list of available client SDKs for different languages is listed in the [Quick Links](#links)

If you use Node.js then you should add dependency to the client SDK into **package.json** file of your project
```javascript
{
    ...
    "dependencies": {
        ....
        "pip-clients-retries-node": "^1.0.*",
        ...
    }
}
```

Inside your code get the reference to the client SDK
```javascript
var sdk = new require('pip-clients-retries-node');
```

Define client configuration parameters that match configuration of the microservice external API
```javascript
// Client configuration
var config = {
    connection: {
        protocol: 'http',
        host: 'localhost', 
        port: 8080
    }
};
```

Instantiate the client and open connection to the microservice
```javascript
// Create the client instance
var client = sdk.RetriesHttpClientV1(config);

// Connect to the microservice
client.open(null, function(err) {
    if (err) {
        console.error('Connection to the microservice failed');
        console.error(err);
        return;
    }
    
    // Work with the microservice
    ...
});
```

Now the client is ready to perform operations
```javascript
// Create a new retry
var retry = {{
    id: '1',
    collection: "c1",
    attempt_count: 1,
    last_attempt_time: new Date(),
    expiration_time: new Date()        
};

client.createRetry(
    null,
    retry,
    function (err, retry) {
        ...
    }
);
```

```javascript
// Get the list of retries on 'time management' topic
client.getRetries(
    null,
    {
        id: '1',
        collection: "c1",
    },
    {
        total: true,
        skip: 0,
        take: 10
    },
    function(err, page) {
    ...    
    }
);
```    

## Acknowledgements

This microservice was created and currently maintained by 
- *Sergey Seroukhov* 
- *Sergey Khoroshikh*
- *Levichev Dmitry*

