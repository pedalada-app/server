var Queue = require('./queue');
var config = require('./config');
var db = require(config.mDbLib);
var MainJob = require('./jobs/main_job');
var CompetitionStandingJob = require('./jobs/competition_standings_job');

db.init("mongodb://localhost/pedalada-data");

db.drop();

var q = new Queue(50, 1000 * 60);

MainJob.init();

q.addJob(new MainJob());