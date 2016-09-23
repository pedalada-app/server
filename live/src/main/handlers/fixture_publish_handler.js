"use strict";

var factory = require('../../../../db/src/main/repositories/factory');
var request = require('request-promise');
var config = require('../config');

class FixturePublishHandler {

	handle(changeFixtures) {
		let fixtureToBackend = [];
		for (let fixture of changeFixtures) {
			if (fixture.status === 'FINISHED') {
				fixtureToBackend.push(fixture);
			}
		}

		request({
			method: 'POST',
			url: config.backendFixureUpdateResource,
			body: {
				fixtures: fixtureToBackend
			}
		})

	}

}

module.exports = FixturePublishHandler;