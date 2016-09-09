var mongoose = require('mongoose');
var fixtureModel = require('../models/fixtures');
var competitionRepository = require('./competition_repository');
var teamRepository = require('./team_repository');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class FixtureConverter {

    from(obj) {
        return Rx.Observable.zip(
            Rx.Observable.fromPromise(competitionRepository.idMapping(obj.competitionId)),
            Rx.Observable.fromPromise(teamRepository.idMapping(obj.homeTeamId)),
            Rx.Observable.fromPromise(teamRepository.idMapping(obj.awayTeamId)),
            function (compid, homeTeamId, awayTeamId) {
                return {
                    api_detail: {
                        id: compid
                    },
                    competitionId: id,
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
                        goalsAwatTeam: obj.result.goalsAwatTeam
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
        this.absRep.insertMany(docs);
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

var obj = new FixtureRepository();

module.exports = obj;