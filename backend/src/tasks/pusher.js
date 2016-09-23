'use strict';

var FCM = require('fcm-node');
var config = require('./config');

var factory = require('../../db/src/repositories/factory');

class FcmPusher {

	constructor() {
		this.fcm = new FCM(config.serverKey);
	}

	push(userId, title, body) {
		factory.userRepo().getById(userId)
			.then(function (user) {
				this.fcm.send({
					to: user.fcmRegistrationToken,
					notification: {
						title: title,
						body: body
					}
				}, function (err) {
					if(err) {
						console.log(err);
					}
				})
			})
	}
}

module.exports = new FcmPusher();

