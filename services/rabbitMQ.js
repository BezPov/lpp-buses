const amqp = require('amqplib/callback_api');

const etcd = require('./etcd');

const watcher = etcd.watcher('cloud_amqp_url');

watcher.on('change', (res) => {
	start(res.node.value);
}); // Triggers on all changes

etcd.get('cloud_amqp_url', (err, res) => {
	if (err) {
		console.log(err);

		return;
	}

	start(res.node.value);
});

let amqpConnection = null;

const start = (cloudAmqpUrl) => {
	amqp.connect(cloudAmqpUrl + '?heartbeat=60', function (err, conn) {
		if (err) {
			console.error('[AMQP]', err.message);

			return setTimeout(start, 1000);
		}

		conn.on('error', function (err) {
			if (err.message !== 'Connection closing') {
				console.error('[AMQP] conn error', err.message);
			}
		});

		conn.on('close', function () {
			console.error('[AMQP] reconnecting');
			return setTimeout(start, 1000);
		});

		console.log('[AMQP] connected');

		amqpConnection = conn;

		startPublisher();
	});
};

let publishChannel = null;

let offlinePublishQueue = [];

function startPublisher() {
	amqpConnection.createConfirmChannel(function (err, channel) {
		if (closeConnectionOnError(err)) return;

		channel.on('error', function (err) {
			console.error('[AMQP] channel error', err.message);

		});

		channel.on('close', function () {
			console.log('[AMQP] channel closed');
		});

		publishChannel = channel;

		while (true) {
			let m = offlinePublishQueue.shift();

			if (!m) break;

			publish(m[0], m[1], m[2]);
		}
	});
}

const QUEUE_NAME = 'metrics';

function publish(exchange, content) {
	try {
		publishChannel.publish(exchange, QUEUE_NAME, content, { persistent: true },
			(err, ok) => {
				if (err) {
					console.error('[AMQP] publish', err);

					offlinePublishQueue.push([exchange, QUEUE_NAME, content]);

					publishChannel.connection.close();
				}
			});
	} catch (ex) {
		console.error('[AMQP] publish', ex.message);

		offlinePublishQueue.push([exchange, QUEUE_NAME, content]);
	}
}

function closeConnectionOnError(err) {
	if (!err) return false;

	console.error('[AMQP] error', err);

	amqpConnection.close();

	return true;
}


module.exports = {
    publish
};