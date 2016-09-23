'use strict';

var express = require('express');
var passport = require('passport');
var router = express.Router();
var utils = require('./router_utils');

var jwt = require('jsonwebtoken');
var config = require('../../config/auth'); // get our config file

var factory = require('../../db/src/repositories/factory');
var userRepo = factory.userRepo();

/* POST users listing. */
router.post('/auth/facebook',
	function (req, res, next) {
		passport.authenticate('facebook-token', function (err, user, info) {
			if (err) {
				console.error(err);
				res.status(401);
				res.send();
				return;
			}
			factory.userRepo().updateFcmToken(user._id, req.query.fcm_token)
				.then(function () {
					console.log("fcm token in inserted");
				});
			jwt.sign(user._id.toString(), config.superSecret, {}, function (err, token) {
				if (err) {
					console.error(err);
					res.send(500);
				} else {
					let resObj = {
						token: token,
						name: user.name,
						photoURL: user.photoURL,
						pedaladas: user.pedaladas
					};
					res.send(resObj);
				}
			});

		})(req, res, next);
	}
);

// check if pass authentication
router.use(function (req, res, next) {
	if (req.authenticate.error) {
		console.error(req.authenticate.error);
		res.status(401);
		res.json({msg: "authentication failed", error: req.authenticate.error})
	} else {
		req.userId = req.authenticate.decoded;
		next();
	}
});

// get user info
router.get('/info', function (req, res) {
	userRepo.getById(req.userId)
		.then(function (user) {
			let data = {
				name: user.name,
				stats: {}
			};

			// add some statistics to data.stats

			res.status(200);
			res.json(data);
		})
		.catch(utils.errorHandler(res))
});

// get fcm token
router.post('/auth/fcm', function (req, res, next) {
	let token = req.body.token;
	userRepo.updateFcmToken(req.userId, token)
		.then(function () {
			res.status(200);
			res.send();
		})
});

// enter
router.post('/checkin', function (req, res, next) {
	let now = new Date();
	let userId = req.userId;
	userRepo.getById(userId)
		.then(function (user) {
			let toSend = {};
			toSend.pedaladas = user.pedaladas;
			let last = user.lastEntrance;
			if (now.getFullYear() > last.getFullYear() ||
				now.getMonth() > last.getMonth() ||
				now.getDate() > last.getDate()) {
				toSend.change = 50;
			} else {
				toSend.change = 0;
			}

			res.status(200);
			res.send(toSend);
			process.nextTick(function () {
				userRepo.updatePedaladas(userId, toSend.change)
					.then(function () {
						return userRepo.checkIn(userId)
					})
					.then(function () {

					})

			})

		});
});

module.exports = router;
