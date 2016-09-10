var teamModel = require('../models/teams');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class TeamConverter {

    from(obj) {
        return Rx.Observable.just({
                api_detail: {
                    id: obj.id
                },
                name: obj.name,
                shortName: obj.shortName,
                squadMarketValue: obj.squadMarketValue,
                crestUrl: obj.crestUrl
            }
        );
    }

}

class TeamRepository {

    constructor() {
        this.absRep = new AbstractRepository(teamModel, new TeamConverter());
    }

    insert(obj) {
        return this.absRep.insert(obj);
    }

    insertMany(docs) {
        return this.absRep.insertMany(docs);
    }

    addFixtures(teamsIds, fixturesIds) {

        return this.absRep.updateMany({_id: {$in : teamsIds}}, {$push: {fixtures : {$each : fixturesIds}}})
    }

    addCompetitions(teamsIds, competitionsIds) {
        return this.absRep.updateMany({_id: {$in : teamsIds}}, {$push: {competitions : {$each : competitionsIds}}})
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

module.exports = TeamRepository;