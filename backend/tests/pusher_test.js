'use strict';

var FCM = require('fcm-node');
var config = require('../src/tasks/config');


class FcmPusher {

	constructor() {
		this.fcm = new FCM(config.serverKey);
	}

	push() {
		this.fcm.send({
			to: "fDREr5AT0Kw:APA91bG1Gq5c4amwh4P9SytxUKCrq3eSy8bJKYfKSRjloSF3s_oZ6UQeIrFNmjFlpPqdfJ5IQY_6LpwgSDfX69Jtw9Pw75EP0nW3IUeehhLdwVKJI-WxtMAvEaugEVzvHwdytxGPToE1",
			notification: {
				title: "yuval",
				body: "danny"
			}
		}, function (err, res) {
			if(err) {
				console.log(err);
			}

			console.log(res);

		})
	}
}

var a = new FcmPusher();
a.push();

