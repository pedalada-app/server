var mongoose = require('mongoose');

var modelFactory = require('./src/main/models/factory');
var repoFactory = require('./src/main/repositories/factory');

var connection;

module.exports.init = function (url, options) {

    options = options || {};

    connection = mongoose.createConnection(url);

    if (options.drop) {
        connection.db.dropDatabase();
    }

    modelFactory.init(connection);
    repoFactory.init();

};

module.exports.drop = function () {

    connection.db.dropDatabase();

};

module.exports.close = function () {

    connection.close();

};

