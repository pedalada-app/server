var FacebookStrategy = require('passport-facebook-token');
var repositoryFactory = require('../db/src/repositories/factory').userRepository;

var configAuth = require('./auth');

var userRepo = repositoryFactory.userRepo();

module.exports = function (passport) {
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret
	}, function (token, refreshToken, profile, done) {
		var userEmail = profile.emails[0].value;
		userRepo.getByMail(userEmail)
			.then(function (user) {
				if (user) { // user already exists
					done(null, user);
				} else { // no exist.
					userRepo.insert(profile)
						.then(function (obj) {
							done(null, obj)
						})
						.catch(function (err) {
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