"use strict";

var CompetitionUpdateHandler = require('./competition_update_handler');
var FixtureUpdateHandler = require('./fixture_update_handler');

var resourceMap = {
    "Competition" : new CompetitionUpdateHandler(),
    "Fixture" : new FixtureUpdateHandler()
};

class HandlerFactory {

    getHandler(resource) {
        return resourceMap[resource];
    }

}

module.exports = HandlerFactory;

