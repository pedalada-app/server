'use strict';

var schedule = require('node-schedule');

var express = require('express');
var router = express.Router();

var updateFormsTasks = require('../tasks/update_forms');

router.post('/fixture/finish', function (req, res, next) {
	let finishedFixtures = req.body.fixtures;
	res.status(200);
	res.send();
	process.nextTick(function () {
		updateFormsTasks(finishedFixtures);
	});
});

module.exports = router;