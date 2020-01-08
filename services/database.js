const mongoose = require('mongoose');

const etcd = require('./etcd');

const connectionOptions = {
    promiseLibrary: global.Promise,
    server: {
        auto_reconnect: true,
        reconnectTries: Number.MAX_VALUE,
        reconnectInterval: 1000
    },
    config: {
        autoIndex: true
    },
    useNewUrlParser: true
};

module.exports = function (successCallback, errorCallback) {
    const connectToDatabase = (dbUrl) => {
        // establish connection to mongodb atlas
        mongoose.Promise = connectionOptions.promiseLibrary;

        mongoose.connect(dbUrl, connectionOptions);

        const db = mongoose.connection;

        db.on('error', (err) => {
            if (err.message.code === 'ETIMEDOUT') {
                console.log(err);

                mongoose.connect(dbUrl, connectionOptions);
            }

            errorCallback();
        });


        db.once('open', () => {
            successCallback();
        });
    };

    const watcher = etcd.watcher("db_url");

    watcher.on("change", (res) => {
        connectToDatabase(res.node.value);
    }); // Triggers on all changes

    etcd.get("db_url", (err, res) => {
        if (err) {
            console.log(err);

            return;
        }

        connectToDatabase(res.node.value);
    });
};