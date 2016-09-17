var modelFactory = require('../models/factory');
var repositoryUtils = require('./repository_utils');
var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class CompetitionConverter {

    from(obj) {
        return Rx.Observable.just({
            api_detail: {
                id: obj.id
            },
            name: obj.caption,
            leagueCode: obj.league,
            year: obj.year,
            currentMatchday: obj.currentMatchday,
            numberOfMatchdays: obj.numberOfMatchdays
        });
    }

}


class CompetitionRepository {

    constructor() {
        this.absRep = new AbstractRepository(modelFactory.competitionModel(), new CompetitionConverter())
    }

    insert(obj) {
        return this.absRep.insert(obj);
    }

    insertMany(docs) {
        return this.absRep.insertMany(docs);
    }

    updateStanding(compId, standingId) {

        return this.absRep.update({_id : compId}, repositoryUtils.setFieldValue({lastStanding : standingId}));
    }

    updateMatchDay(compId, matchDay) {
        return this.absRep.update({_id : compId}, repositoryUtils.setFieldValue({currentMatchday: matchDay}));
    }

    addFixtures(compId, fixturesIds) {
        return this.absRep.update({_id : compId}, {$push : {fixtures : {$each : fixturesIds}}});
    }

    addTeams(compId, teamsIds) {
        return this.absRep.update({_id : compId}, {$push : {teams : {$each : teamsIds}}});
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

module.exports = CompetitionRepository;