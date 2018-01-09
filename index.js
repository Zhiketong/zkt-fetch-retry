const fetch = require('zkt-fetch');
const wait = require('delay');

module.exports = async (url, options) => {

	let retry = options && options.retry ? options.retry : 3;
	let retryDelay = options && options.retryDelay ? options.retryDelay : 1000;

	let tried = 0, res = null, fetchError = null, shouldRetry = false;

	do {

		if (shouldRetry) {
			await wait(retryDelay);
		}

		shouldRetry = false;
		try {
			res = await fetch(url, options);
		} catch (err) {
			fetchError = err;
			if (err && err.name === 'FetchError') {
				//system error
				if (err.type === 'system' && err.code === 'ECONNRESET') {
					shouldRetry = true;
				}
				//timeout error
				if (err.type === 'request-timeout') {
					shouldRetry = true;
				}
			}

			if (shouldRetry) {
				console.log(`zkt-fetch-retry ${url} with options`, options, 'got error, will retry, error=', err);
			}
		}

		tried++;

	} while ( shouldRetry && tried < retry );

	if (res && fetchError) {
		console.log(`zkt-fetch-retry success after ${tried} times, url=${url}, options=`, options, 'last error', fetchError);
	}

	if (fetchError && !res) {
		fetchError.tried = tried;
		throw fetchError;
	} else {
		if (res) res.tried = tried;
		return res;
	}
};