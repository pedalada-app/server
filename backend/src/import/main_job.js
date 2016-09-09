var Client = require('football-api-client')('');

function start(queue) {

    Client.getCompetitions(2016)
        .then(function (competitions) {

        })

}