'use strict';
var config = require('../config');
var client = require('football-api-client')(config.apiKey);

var factory = require('../../../../db/src/main/repositories/factory');
var handlerFactory = require('../handlers/handler_factory');

var Rx = require('rx');

module.exports = function () {
	Rx.Observable.fromPromise(client.getCompetitions())
		.subscribe(function (competitions) {
			handlerFactory().getHandler('Competition', competitions.data);
		})
};