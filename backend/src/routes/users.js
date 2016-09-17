var express = require('express');
var passport = require('passport');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../../config/auth'); // get our config file

var factory = require('../../db/src/repositories/factory');
var userRepo = factory.userRepo();

/* GET users listing. */
router.get('/auth/facebook',
	function (req, res, next) {
		passport.authenticate('facebook-token', function (err, user, info) {
			if (err) {
				console.error(err);
				res.status(401);
				res.send();
				return;
			}
			jwt.sign(user._id, config.superSecret, {}, function (err, token) {
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
		res.userId = res.authenticate.decoded;
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
		.catch(function (err) {
			console.error(err);
			res.status(500);
			res.json({msg: "internal error", error: err})
		})
});


module.exports = router;
