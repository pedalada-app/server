var teamModel = require('../models/teams');

class TeamConverter {

    from(obj) {
        return {
            api_detail: {
                id: obj.id
            },
            name: obj.name,
            shortName: obj.shortName,
            suqadMarketValue: obj.suqadMarketValue,
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

    idMapping(id) {
        return this.absRep.idMapping(id);
    }

}

var obj = new TeamRepository();

module.exports = obj;