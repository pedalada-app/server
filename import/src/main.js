var Queue = require('./queue');

var config = require('./config');

var db = require(config.dbLib);

var MainJob = require('./jobs/main_job');

db.init("mongodb://localhost/pedalada-data")
    .then(function () {

        var q = new Queue(50, 1000 * 60);

        q.addJob(new MainJob());

    });
