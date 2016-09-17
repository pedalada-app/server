var competitionSchema = require('../schema/competition');
var fixtureSchema = require('../schema/fixture');
var standingsSchema = require('../schema/standings');
var teamSchema = require('../schema/team');


class Factory {

    constructor() {

    }

    init(connection) {
        this._competitionModel = connection.model('Competition', competitionSchema);
        this._fixtureModel = connection.model('Fixture', fixtureSchema);
        this._standingsModel = connection.model('Standings', standingsSchema);
        this._teamsModel = connection.model('Team', teamSchema);


    }

    competitionModel() {
        return this._competitionModel;
    }

    fixtureModel() {
        return this._fixtureModel;
    }

    standingsModel() {
        return this._standingsModel;
    }

    teamModel() {
        return this._teamsModel;
    }

}

module.exports = new Factory();