"use strict";

// var FixtureRepository = require('../../../../db/src/main/repositories/fixture_repository');

// var fixtRepo = new FixtureRepository();
var OLD_VAL = 0;
var NEW_VAL = 1;

var scoreParser = function (score) {
    return {
        goalsHomeTeam : score.substr(0, score.indexOf(":")),
        goalsAwayTeam : score.substr(score.indexOf(":") + 1)
    }
};

class FixtureUpdateHandler {

    handle(options) {
        // let fixtId = fixtRepo.idMapping(options['Id']);
        // for (let update of options['Updates']) {
        //     if (update["Score"]) {
        //         let result = scoreParser(update["Score"][NEW_VAL]);
        //         // fixtRepo.updateResult(fixtId, result);
        //     }
        //     if (update['Status']) {
        //         fixtRepo.updateStatus(fixtId, update['Status'][NEW_VAL]);
        //     }
        // }
    }

}

module.exports = FixtureUpdateHandler;