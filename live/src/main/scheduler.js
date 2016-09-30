'use strict';

var schedule = require('node-schedule');

var fixtureJob = require('./tasks/fixtures');
var competitionJob = require('./tasks/competitions');

var config = require('./config');

class Scheduler {
	init() {
		schedule.scheduleJob(config.fixturesUpdateFrequency, fixtureJob);
		schedule.scheduleJob(config.competitionsUpdateFrequency, competitionJob);
	}
}

module.exports = new Scheduler();
