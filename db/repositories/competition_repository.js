var competitionModel = require('../models/competition');
var standingRepository = require('./standings_repository');
var fixtureRepository = require('./fixture_repository');
var repositoryUtils = require('./repository_utils');

class CompetitionConverter {

    from(obj) {
        return {
            api_detail: {
                id: obj.id
            },
            name: obj.caption,
            leagueCode: obj.league,
            year: obj.year,
            currentMatchday: obj.currentMatchday,
            numberOfMatchdays: obj.numberOfMatchdays
        }
    }

}

class CompetitionRepository {

    constructor() {
        this.absRep = new AbstractRepository(competitionModel, new CompetitionRepository())
    }

    insert(obj) {
        return this.absRep.insert(obj);
    }

    insertMany(docs) {
        this.absRep.insertMany(docs);
    }

    updateStanding(compId, standing) {
        var that = this;
        return standingRepository.insert(standing)
            .flatMap(function (obj) {
                return that.absRep.update({_id : compId}, {lastStanding : obj._id});
            });

    }

    updateMatchDay(compId, matchDay) {
        return this.absRep.update({_id : compId}, {currentMatchday : matchDay});
    }

    addFixtures(compId, fixtures) {

        let that = this;
        return fixtureRepository.insertMany(fixtures)
            .flatMap(function(obj) {
                let ids = [];
                for (let ins of obj) {
                    ids.push(ins._id);
                }
                return that.absRep.update({_id : compId}, {$add : {fixtures : ids}})
            });
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

var obj = new CompetitionRepository();

module.exports = obj;