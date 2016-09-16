var mongoose = require('mongoose');
module.exports.userRepository = require('./src/repositories/user_repository')

module.exports.init = function (url) {
	return mongoose.connect(url)
		.then(function () {

		})
};