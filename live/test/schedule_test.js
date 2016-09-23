'use strict';

var schedule = require('node-schedule');

var config = require('../src/main/config');
var client = require('football-api-client')(config.apiKey);

schedule.scheduleJob('*/10 * * * * *', function () {
	client.getFixtures({timeFrame: 'p1'})
		.then(function (comp) {
			console.log(comp);
		})
});
