
var CompetitionRepository = require('./competition_repository');
var FixtureRepository = require('./fixture_repository');
var StandingsRepository = require('./standings_repository');
var TeamRepository = require('./team_repository');

class RepositoryFactory {

    constructor() {

    }

    init() {
        this._competitionRepo = new CompetitionRepository();
        this._fixtureRepo = new FixtureRepository();
        this._standingsRepo = new StandingsRepository();
        this._teamsRepo = new TeamRepository();
    }

    competitionRepo() {
        return this._competitionRepo;
    }

    fixtureRepo() {
        return this._fixtureRepo;
    }

    standingsRepo() {
        return this._standingsRepo;
    }

    teamRepo() {
        return this._teamsRepo;
    }

}

module.exports = new RepositoryFactory();