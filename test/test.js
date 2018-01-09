const fetch = require('../');

require('http').createServer((req, res) => {
	switch(req.url) {
		case '/badJSON': 
			if (Math.random() < 0.5) {
				res.writeHead(502, 'interval error');
				res.end();
			} else {
				res.end('{aaa');
			}
			break;
		case '/goodJSON':
			res.end(JSON.stringify({success: true}));
			break;
		case '/timeout':
			console.log(req.url);
			setTimeout(() => {
				res.end(JSON.stringify({success: true}));
			}, Math.floor(Math.random() * 2000));
			break;
		case '/404':
			res.writeHead(404, 'Not Found');
			res.end();
			break;
		default: 
			res.end('ok');
	}
}).listen(6756, async () => {

	await fetch('http://localhost:6756/timeout', {
		timeout: 1000,
		retry: 3,
		retryDelay: 1000
	}).then(res => {
		console.log('res', res);
	}).catch(err => {
		console.error('ERROR', err);
	});


	process.exit();
});

