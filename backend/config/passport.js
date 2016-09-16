var FacebookStrategy = require('passport-facebook-token');
var UserRepository = require('../db/index').userRepository;
var configAuth = require('./auth');

var userRepo = new UserRepository();

var createUserObj = function (profile) {
	return {
		facebookId: profile.id,
		email: profile.emails[0].value,
		name: profile.displayName,
		photoURL: profile.photos[0].value
	}
};

module.exports = function (passport) {
	passport.use(new FacebookStrategy({
		clientID: configAuth.facebookAuth.clientID,
		clientSecret: configAuth.facebookAuth.clientSecret
	}, function (token, refreshToken, profile, done) {
		var newUser = createUserObj(profile);
		userRepo.getByMail(newUser.email)
			.then(function (user) {


				if (user) { // user already exists
					console.log(user);
					done(null, user);
				} else { // no exist.
					userRepo.insert(newUser)
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