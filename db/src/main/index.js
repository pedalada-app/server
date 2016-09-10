var mongoose = require('mongoose');

module.exports.CompetitionRepository = require('./repositories/competition_repository');
module.exports.FixtureRepository = require('./repositories/fixture_repository');
module.exports.StandingRepository = require('./repositories/standings_repository');
module.exports.TeamRepository = require('./repositories/team_repository');

module.exports.init = function (url) {
    return mongoose.connect(url);
}