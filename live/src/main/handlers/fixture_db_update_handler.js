"use strict";

var factory = require('../../../db/src/main/repositories/factory');

var getFixtureName = function (fixture) {
	return fixture.homeTeam.name + " - " + fixture.awayTeam.name;
}

class FixtureDbUpdateHandler {

	constructor() {
		factory.init();
	}

    handle(changeFixtures) {

		console.log("fixture db update handler");

		for (let fixture of changeFixtures) {

			factory.fixtureRepo().updateFixture(fixture._id, fixture.result, fixture.status, fixture.odds)
				.then(function (status) {
					console.log(status);
					console.log("the game : " + getFixtureName(fixture) + " has updated");
				});
		}
    }

}

module.exports = FixtureDbUpdateHandler;