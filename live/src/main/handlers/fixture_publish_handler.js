"use strict";

var factory = require('../../../db/src/main/repositories/factory');
var request = require('request-promise');
var config = require('../config');

class FixturePublishHandler {

	constructor() {
		factory.init();
	}

	handle(changeFixtures) {

		console.log("fixture publish handler");

		let fixtureToBackend = [];
		for (let fixture of changeFixtures) {
			if (fixture.status === 'FINISHED') {
				fixtureToBackend.push(fixture);
			}
		}

		if(fixtureToBackend.length !== 0) {
			request({
				method: 'POST',
				url: config.backendFixureUpdateResource,
				body: {
					fixtures: fixtureToBackend,
					token: config.backendSecret
				},
				json: true
			})
		}
	}

}

module.exports = FixturePublishHandler;