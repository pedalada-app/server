var schedule = require('node-schedule');

var j = schedule.scheduleJob('*/5 * * * * *', function () {
	console.log("5 seconds pass");
});

console.log(j);