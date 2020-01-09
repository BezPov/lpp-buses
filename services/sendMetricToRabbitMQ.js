const rabbitMQ = require('../services/rabbitMQ');

const { performance } = require('perf_hooks');

module.exports = function (req) {
	const metric = {
		service: {
			name: process.env.npm_package_name,
			version: process.env.npm_package_version,
			url: req.url,
			method: req.method
		},
		request: {
			url: req.connection.remoteAddress,
			duration: performance.now() - req.startTime
		},
		type: 'request'
	};

	rabbitMQ.publish('', new Buffer(JSON.stringify(metric)));
};