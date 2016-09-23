"use strict";

var factory = require('../../../../db/src/main/repositories/factory');

class FixtureDbUpdateHandler {

    handle(changeFixtures) {
		for (let fixture of changeFixtures) {
			factory.fixtureRepo().updateResult(fixture._id, fixture.result)
				.then(function () {
					return factory.fixtureRepo().updateStatus(fixture._id, fixture.status);
				})
				.then(function () {
					console.log("fixture updated in the DB");
				})
		}
    }

}

module.exports = FixtureDbUpdateHandler;