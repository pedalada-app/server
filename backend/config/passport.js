var FacebookStrategy = require('passport-facebook-token');
var repositoryFactory = require('../db/src/repositories/factory');

var configAuth = require('./auth');


module.exports = function (passport) {
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret
	}, function (token, refreshToken, profile, done) {
		var userEmail = profile.emails[0].value;
		repositoryFactory.userRepo().getByMail(userEmail)
			.then(function (user) {
				if (user) { // user already exists
					done(null, user);
				} else { // no exist.
					repositoryFactory.userRepo().insert(profile)
						.subscribe(function (obj) {
							done(null, obj)
						}, function (err) {
							console.error(err);
							done(err);
						})
				}
			})
			.catch(function (err) {
				console.error(err);
				done(err);
			});
	}));
};