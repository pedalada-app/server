var express = require('express');
var passport = require('passport');
var router = express.Router();

var jwt = require('jsonwebtoken');
var config = require('../../config/auth'); // get our config file

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

module.exports = router;
