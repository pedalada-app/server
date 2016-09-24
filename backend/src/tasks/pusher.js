'use strict';

var FCM = require('fcm-node');
var config = require('./config');

var factory = require('../../db/src/repositories/factory');

class FcmPusher {

	constructor() {
		this.fcm = new FCM(config.serverKey);
	}

	push(userId, title, body) {
		let self = this;
		factory.userRepo().getById(userId)
			.then(function (user) {
				self.fcm.send({
					to: user.fcmRegistrationToken,
					notification: {
						title: title,
						body: body
					}
				}, function (err, res) {
					if(err) {
						console.error(err);
					}
					console.log(res);
				})
			})
	}
}

module.exports = new FcmPusher();

