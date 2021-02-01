# @securityin/aquasphere-api

## Installation & import

Installation -

```
In dependencies section of package.json, add a line "@securityin/aquasphere-api": "https://github.com/securityin/aquasphere-api/tree/main/packages/api/build"
```

Subscribing to blocks via Promise-based API -

```javascript
import { ApiPromise } from '@securityin/aquasphere-api';

// initialise via static create
const api = await ApiPromise.create();

// make a call to retrieve the current network head
api.rpc.chain.subscribeNewHeads((header) => {
  console.log(`Chain is at #${header.number}`);
});
```

Subscribing to blocks via RxJS-based API -

```javascript
import { ApiRx } from '@securityin/aquasphere-api';

// initialise via static create
const api = await ApiRx.create().toPromise();

// make a call to retrieve the current network head
api.rpc.chain.subscribeNewHeads().subscribe((header) => {
  console.log(`Chain is at #${header.number}`);
});
```

## Registering custom types

Additional types used by runtime modules can be added when a new instance of the API is created. This is necessary if the runtime modules use types which are not available in the base Substrate runtime.

```javascript
import { ApiPromise } from '@securityin/aquasphere-api';

// initialise via static create and register custom types
const api = await ApiPromise.create({
  types: {
    CustomTypesExample: {
      "id": "u32",
      "data": "Vec<u8>",
      "deposit": "Balance",
      "owner": "AccountId",
      "application_expiry": "Moment",
      "whitelisted": "bool",
      "challenge_id": "u32"
    }
  }
});
```