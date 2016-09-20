'use strict';

var schedule = require('node-schedule');

var fixtureJob = require('./jobs/fixtures');


schedule.cancelJob('*/5 * * * * *', fixtureJob());


