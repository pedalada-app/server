'use strict';
var config = require('../config');
var client = require('football-api-client')(config.apiKey);

var Rx = require('rx');

module.exports = function () {
	return function () {
		Rx.Observable.fromPromise(client.getFixtures({timeFrame : 'n1'}))
			.flatMap(function (fixtures) {
				return Rx.Observable.from(fixtures)
			})
			.flatMap(function (fixture) {

			})
	}
};