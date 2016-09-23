"use strict";

var CompetitionMatchdayUpdateHandler = require('./competition_matchday_update_handler');
var FixtureDbUpdateHandler = require('./fixture_db_update_handler');
var FixturePublishHandler = require('./fixture_publish_handler');

var resourceMap = {
    "Competition" : [new CompetitionMatchdayUpdateHandler()],
    "Fixture" : [new FixtureDbUpdateHandler(), new FixturePublishHandler()]
};

class HandlerFactory {

    getHandler(resource, changedFixtures) {
        let handlers = resourceMap[resource];
		for (let handler of handlers) {
			handler.handle(changedFixtures)
		}
    }

}

module.exports = HandlerFactory;

