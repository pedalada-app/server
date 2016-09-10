var fixtureModel = require('../models/fixtures');
var CompetitionRepository = require('./competition_repository');
var TeamRepository = require('./team_repository');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class FixtureConverter {

    constructor() {
        this.CompRepo = new CompetitionRepository();
        this.teamRepo = new TeamRepository()
    }

    from(obj) {
        return Rx.Observable.zip(
            Rx.Observable.fromPromise(this.CompRepo.idMapping(obj.competitionId)),
            Rx.Observable.fromPromise(this.teamRepo.idMapping(obj.homeTeamId)),
            Rx.Observable.fromPromise(this.teamRepo.idMapping(obj.awayTeamId)),
            function (compid, homeTeamId, awayTeamId) {
                return {
                    api_detail: {
                        id: obj.id
                    },
                    competitionId: compid,
                    date: new Date(obj.date),
                    status: obj.status,
                    matchday: obj.matchday,
                    homeTeam: {
                        name: obj.homeTeamName,
                        id: homeTeamId
                    },
                    awayTeam: {
                        name: obj.awayTeamName,
                        id: awayTeamId
                    },
                    result: {
                        goalsHomeTeam: obj.result.goalsHomeTeam,
                        goalsAwayTeam: obj.result.goalsAwayTeam
                    },
                    odds: obj.odds
                }
            }
        );
    }

}

class FixtureRepository {


    constructor() {
        this.absRep = new AbstractRepository(fixtureModel, new FixtureConverter());
    }

    insert(obj) {
        return this.absRep.insert(obj);
    }

    insertMany(docs) {
        return this.absRep.insertMany(docs);
    }

    updateResult(fixtureId, result) {
        return this.absRep.update({_id : fixtureId}, {result : result});
    }

    updateStatus(fixtureId, status) {
        return this.absRep.update({_id : fixtureId}, {status : status});
    }

    updateDate(fixtureId, date) {
        return this.absRep.update({_id : fixtureId}, {date : date});
    }

    updateOdds(fixtureId, odds) {
        return this.absRep.update({_id : fixtureId}, {odds : odds});
    }

    getByApiId(apiId) {
        return repositoryUtils.getByApiId(this, apiId);
    }

    getById(id) {
        return repositoryUtils.getById(this, id);
    }

    idMapping(id) {
        return this.absRep.idMapping(id);
    }
}

module.exports = FixtureRepository;