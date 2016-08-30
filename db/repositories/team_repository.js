var teamModel = require('../models/teams');
var fixtureRepository = require('./fixture_repository');
var competitonRepository = require('./competition_repository');
var repositoryUtils = require('./repository_utils');

class TeamConverter {

    from(obj) {
        return {
            api_detail: {
                id: obj.id
            },
            name: obj.name,
            shortName: obj.shortName,
            squadMarketValue: obj.squadMarketValue,
            crestUrl: obj.crestUrl
        }
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
        this.absRep.insertMany(docs);
    }

    addFixtures(teamId, fixtures) {

        let that = this;
        return fixtureRepository.insertMany(fixtures)
            .flatMap(function(obj) {
                let ids = [];
                for (let ins of obj) {
                    ids.push(ins._id);
                }
                return that.absRep.update({_id : teamId}, {$add : {fixtures : ids}})
            });
    }

    addCompetition(teamId, competitions) {

        let that = this;
        return competitonRepository.insertMany(competitions)
            .flatMap(function(obj) {
                let ids = [];
                for (let ins of obj) {
                    ids.push(ins._id);
                }
                return that.absRep.update({_id : teamId}, {$add : {competitions : ids}})
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

var obj = new TeamRepository();

module.exports = obj;