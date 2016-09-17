var mongoose = require('mongoose');

var factory = require('./models/factory');

module.exports.CompetitionRepository = require('./repositories/competition_repository');
module.exports.FixtureRepository = require('./repositories/fixture_repository');
module.exports.StandingRepository = require('./repositories/standings_repository');
module.exports.TeamRepository = require('./repositories/team_repository');

var connection;

module.exports.init = function (url, options) {

    options = options || {};

    connection = mongoose.createConnection(url);

    if (options.drop) {
        connection.db.dropDatabase();
    }

    factory.init(connection);

};

module.exports.drop = function () {

    connection.db.dropDatabase();

};

module.exports.close = function () {

    connection.close();

};

