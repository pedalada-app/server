var Queue = require('./queue');

var MainJob = require('./main_job');

var q = new Queue(50, 1000 * 60);

q.addJob(new MainJob());