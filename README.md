# zkt-fetch
wrapper of zkt-fetch to provide retry feature

## Install

`npm i --save zkt-fetch-retry`

## Usage

replace your `require('zkt-fetch')` with `require('zkt-fetch-retry')`

```javascript
const fetch = require('zkt-fetch-retry');
fetch(url, {
	retry: 3,
	retryDelay: 1000
}).then(...).catch(...);
```

## options

- `retry` retry times, default to 3

- `retryDelay` wait time in ms between retries, default to 1000
