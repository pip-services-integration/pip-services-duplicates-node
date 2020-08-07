# HTTP Protocol (version 1) <br/> Retries Microservice

Jobs microservice implements a HTTP compatible API, that can be accessed on configured port.
All input and output data is serialized in JSON format. Errors are returned in [standard format]().

* [POST /v1/retries/get_group_names](#operation1)
* [POST /v1/retries/get_retries](#operation2)
* [POST /v1/retries/add_retry](#operation3)
* [POST /v1/retries/add_retries](#operation4)
* [POST /v1/retries/get_retry_by_id](#operation5)
* [POST /v1/retries/get_retry_by_ids](#operation6)
* [POST /v1/retries/delete_retry](#operation7)
* [POST /v1/retries/delete_expired](#operation8)

## Operations

### <a name="operation1"></a> Method: 'POST', route '/v1/retries/get_group_names'

Get all groups names

**Request body:** 
- none

**Response body:**
items:Arary<string> - array with group names

### <a name="operation2"></a> Method: 'POST', route '/v1/retries/get_retries'

Get retry by filter

**Request body:** 
- filter: Object
    - id: string - (optional) unique retry id
    - group: string - (optional) retry group name
    - attempt_count: number - (optional) attempt count
    - last_attempt_time: Date - (optional) last attempt time
    - expiration_time: Date - (optional) expiration time
    
- paging: Object
  - skip: int - (optional) start of page (default: 0). Operation returns paged result
  - take: int - (optional) page length (max: 100). Operation returns paged result

**Response body:**
- page: DataPage<RetryV1> - page with retrieved retries

### <a name="operation3"></a> Method: 'POST', route '/v1/retries/add_retry'

Add retry

**Request body:**
- group: string - group name
- attempt_count: number - attempt count
- last_attempt_time: Date - last attempt time
- ttl: number -  Time to live in ms

**Response body:**
- none

### <a name="operation4"></a> Method: 'POST', route '/v1/retries/add_retries'

Add retries

**Request body:**
- ids: string[] - ids
- group: string - group name
- ttl: number -  Time to live in ms

**Response body:**
- none

### <a name="operation5"></a> Method: 'POST', route '/v1/retries/get_retry_by_id'

Get retry by id

**Request body:**
- group: string - group name
- id: string - id

**Response body:**
- id: string - id retry
- group: string - group name
- attempt_count: number - attempt count
- last_attempt_time: Date - last attempt time
- expiration_time: Date -  expiration time

### <a name="operation6"></a> Method: 'POST', route '/v1/retriesget_retry_by_ids'

Get external id by internal id and group name

**Request body:**
- group: string - group name
- attempt_count: number - external id value

**Response body:**
- external_id: string - external id value

### <a name="operation7"></a> Method: 'POST', route '/v1/retries/delete_retry'

 Delete retry by id 

**Request body:**
- group: string - group name
- id: string - id name

**Response body:**
- none

### <a name="operation8"></a> Method: 'POST', route '/v1/retries/delete_expired'

 Delete expired retries

**Request body:**

**Response body:**
- none