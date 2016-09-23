'use strict';

var schedule = require('node-schedule');

var fixtureJob = require('./tasks/fixtures');
var competitionJob = require('./tasks/competitions');


schedule.scheduleJob('*/3 * * * *', fixtureJob());
schedule.scheduleJob('*/31 * * * *', competitionJob());
