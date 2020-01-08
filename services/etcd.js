const Etcd = require('node-etcd');

const etcd = new Etcd(process.env.ETCD_SERVER);

module.exports = etcd;