var competitionModel = require('../models/competition');

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

    idMapping(id) {
        return this.absRep.idMapping(id);
    }

}

var obj = new CompetitionRepository();

module.exports = obj;