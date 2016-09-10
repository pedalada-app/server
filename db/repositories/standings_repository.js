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
        return Rx.Observable.zip(
            Rx.Observable.fromPromise(this.compRepo.idMapping(obj.competitionId)),
            Rx.Observable.from(obj.standing)
                .map(function (team) {
                    return team.id;
                })
                .flatMap(function (teamId) {
                    return Rx.Observable.fromPromise(this.teamRepo.idMapping(teamId));
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

    insertMany(docs) {
        return this.absRep.insertMany(docs);
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

module.exports = StandingsRepository;
