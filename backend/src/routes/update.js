'use strict';

var schedule = require('node-schedule');

var express = require('express');
var router = express.Router();

var authConfig = require('../../config/auth');

var updateFormsTasks = require('../tasks/update_forms');

router.post('/fixture/finish', function (req, res, next) {
	let finishedFixtures = req.body.fixtures || [];
	let secret = req.body.token || "";
	if (secret !== authConfig.liveSecret) {
		console.error("get update request from demon server...");
		res.status(404);
		res.send();
	} else {
		res.status(200);
		res.send();
		process.nextTick(function () {
			updateFormsTasks(finishedFixtures);
		});
	}
});

module.exports = router;