const winston = require('winston');

require('winston-logstash');

const etcd = require('./etcd');

const addLogstash = (logstashUrl) => {
    const [logstashHost, logstashPort] = logstashUrl.split(':');

    winston.add(winston.transports.Logstash, {
        port: logstashPort,
        host: logstashHost,
        ssl_enable: true,
        max_connect_retries: -1
    });
};

const watcher = etcd.watcher("logstash_url");

watcher.on("change", (res) => {
    addLogstash(res.node.value);
}); // Triggers on all changes

etcd.get("logstash_url", (err, res) => {
    if (err) {
        console.log(err);

        return;
    }

    addLogstash(res.node.value);
});

module.exports = winston;