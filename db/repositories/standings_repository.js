var mongoose = require('mongoose');
var standingsModel = require('../models/standings');
var competitionRepository = require('./competiton_repository');
var teamRepository = require('./team_repository');
var Rx = require('rx');

class StandingsConverter {

    from(obj) {
        return Rx.Observable.zip(
            Rx.Observable.fromPromise(competitionRepository.idMapping(obj.competitionId)),
            Rx.Observable.from(obj.standing)
                .map(function (team) {
                    return team.id;
                })
                .flatMap(function (teamId) {
                    return Rx.Observable.fromPromise(teamRepository.idMapping(teamId));
                })
                .reduce(function (acc, val) {
                    acc.push(val);
                }, []),
            function (compId, standingTeamIds) {

                let standing = [];
                for (let i = 0; i < standingTeamIds.length; i++) {
                    let team = obj.standing[i];

                    standing[i] = {
                        teamId: standingTeamIds[i],
                        name: team.teamName,
                        playedGames: playedGame,
                        points: team.points,
                        goals: team.goals,
                        goalsAgainst: team.goalsAgainst
                    }
                }

                return {
                    compId: compId,
                    matchday: obj.matchday,
                    standing: standing
                }
            }
        );
    }

}

class StandingsRepository {
    constructor() {
        this.absRep = new AbstractRepository(standingsModel, new StandingsConverter());
    }

    insert(obj) {
        return this.absRep.insert(obj);
    }

    idMapping(id) {
        return this.absRep.idMapping(id);
    }
}

var obj = new StandingsRepository();

module.exports = obj;