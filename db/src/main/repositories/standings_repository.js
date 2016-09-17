var factoryModel = require('../models/factory');
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
                .concatMap(function (teamId) {
                    return self.teamRepo.getByApiId(teamId);
                })
                .reduce(function (acc, val) {
                    acc.push(val);
                    return acc;
                }, []),
            function (compId, teams) {

                let standing = [];
                for (let i = 0; i < teams.length; i++) {
                    let team = obj.standing[i];

                    let teamData = teams[i];

                    standing[i] = {
                        teamId: teamData._id,
                        name: teamData.shortName || teamData.name,
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
        this.absRep = new AbstractRepository(factoryModel.standingsModel(), new StandingsConverter());
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
