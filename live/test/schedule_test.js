var schedule = require('node-schedule');

schedule.scheduleJob('*/5 * * * * *', function () {
	console.log("5 seconds pass");
});