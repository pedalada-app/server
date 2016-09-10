var standingsModel = require('../models/standings');
var CompetitionRepository = require('./competition_repository');
var TeamRepository = require('./team_repository');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class StandingsConverter {

    constructor() {
        this.compRepo = new CompetitionRepository();
        this.teamRepo = new TeamRepository();
    }

    from(obj) {
        var self = this;
        return Rx.Observable.zip(
            Rx.Observable.fromPromise(self.compRepo.idMapping(obj.competitionId)),
            Rx.Observable.from(obj.standing)
                .map(function (team) {
                    return team.teamId;
                })
                .flatMap(function (teamId) {
                    return Rx.Observable.fromPromise(self.teamRepo.idMapping(teamId));
                })
                .reduce(function (acc, val) {
                    acc.push(val);
                    return acc;
                }, []),
            function (compId, standingTeamIds) {

                let standing = [];
                for (let i = 0; i < standingTeamIds.length; i++) {
                    let team = obj.standing[i];

                    standing[i] = {
                        teamId: standingTeamIds[i],
                        name: team.team,
                        playedGames: team.playedGames,
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

    insertMany(docs) {
        return this.absRep.insertMany(docs);
    }

    removeStanding(standId) {
        return this.absRep.delete(standId);
    }

    getById(id) {
        return repositoryUtils.getById(this, id);
    }

}

module.exports = StandingsRepository;
