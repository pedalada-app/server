'use strict';
var config = require('../config');
var client = require('football-api-client')(config.apiKey);

var factory = require('../../../../db/src/main/repositories/factory');
var handlerFactory = require('../handlers/handler_factory');

var Rx = require('rx');

var createIdToFixtureMap = function (fixtures) {
	let map = {};
	for (let fixture of fixtures) {
		map[fixture.id] = fixture;
	}
	return map;
};

var fixtureChanged = function (updated, fromDb) {
	if (updated.status !== fromDb.status) {
		return true;
	}
	if (updated.result.goalsHomeTeam !== fromDb.result.goalsHomeTeam ||
		updated.result.goalsAwayTeam !== fromDb.result.goalsAwayTeam) {
		return true;
	}
	return false;
};

module.exports = function () {
	Rx.Observable.zip(
		Rx.Observable.fromPromise(client.getFixtures({timeFrame: 'p1'})),
		Rx.Observable.fromPromise(client.getFixtures({timeFrame: 'n1'})),
		function (arr) {
			let changeYesterday = arr[0].data.fixtures;
			let todayAndTomorrow = arr[1].data.fixtures;

			let idToFixtureMap = createIdToFixtureMap(changeYesterday.concat(todayAndTomorrow));
			let changedFixtures = []
			factory.fixtureRepo().getByApiIds(Object.keys(idToFixtureMap))
				.flatMap(function (dbFixtures) {
					for (let dbFixture of dbFixtures) {
						if (fixtureChanged(idToFixtureMap[dbFixture.api_detail.id], dbFixture)) {
							changedFixtures.push(dbFixture);
						}
					}
					handlerFactory().getHandler("Fixture", changedFixtures);
				})
		})
};