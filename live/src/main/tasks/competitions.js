'use strict';
var config = require('../config');
var client = require('football-api-client')(config.apiKey);

var factory = require('../../../../db/src/main/repositories/factory');
var HandlerFactory = require('../handlers/handler_factory');

var handler = new HandlerFactory();

var Rx = require('rx');

module.exports = function () {
	Rx.Observable.fromPromise(client.getCompetitions())
		.subscribe(function (competitions) {
			handler.getHandler('Competition', competitions.data);
		})
};