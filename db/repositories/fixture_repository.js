var mongoose = require('mongoose');
var fixtureModel = require('../models/fixtures');
var competitionRepository = require('./competiton_repository');
var teamRepository = require('./team_repository');
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

    idMapping(id) {
        return this.absRep.idMapping(id);
    }
}

var obj = new FixtureRepository();

module.exports = obj;