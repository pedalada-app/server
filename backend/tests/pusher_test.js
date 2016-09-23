'use strict';

var FCM = require('fcm-node');
var config = require('../src/tasks/config');


class FcmPusher {

	constructor() {
		this.fcm = new FCM(config.serverKey);
	}

	push() {
		this.fcm.send({
			to: "doYQbULhla0:APA91bHOTES7tt7ccOWmRsb0_axcIc_AQHoweVVdyml-NazaXYfIzi6GP_tX064CYQt1G3okTQRTCANi_nPZkKSreizXtFZZ238sV6jlY8EzGSqknZV40sQR5CrJMtDials3C84EKiJ_",
			notification: {
				title: "yuval",
				body: "danny"
			}
		}, function (err) {
			if(err) {
				console.log(err);
			}

		})
	}
}

var a = new FcmPusher();
a.push();

