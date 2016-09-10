let config = require('../config');

let Client = require('football-api-client')(config.apiKey);

let CompetitionJob = require('./competition_job');

class MainJob {

    start(queue) {

        console.log("Main job");

        return Client.getCompetitions(2016)
            .then(function (result) {

                let competitions = result.data;

                for (let competition of competitions) {
                    let compJob = new CompetitionJob(competition);

                    if (competition.id !== 426) {
                        continue;
                    }

                    queue.addJob(compJob);
                }

            })
            .catch(function (err) {
                console.error(err);
            })

    }

}

module.exports = MainJob;
