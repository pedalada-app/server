var Client = require('football-api-client')('');

var CompRepository = require('dbLib').CompetitionRepository;
var compRepo = new CompRepository();

var TeamJob = require('./team_job');

var CompetitionStandingJob = require('./competition_standings');
var CompetitionFixturesJob = require('./competition_fixtures');

class CompetitionJob {

    constructor(comp) {
        this.comp = comp;
        this.teamCount = 0;
        this.teamIds = [];
    }

    start(queue) {

        let self = this;

        self.queue = queue;

        compRepo.insert(self.comp)
            .then(function (savedComp) {

                self.compDbId = savedComp._id;

                return Client.getCompetitionById(self.comp.id)
                    .getTeams();

            })
            .then(function () {

                for (let team of teams) {
                    CompetitionJob.createTeamJob(queue, team, self.callback);
                }

            })
            .catch(function (err) {
                console.error(err);
                queue.addJob(self);
            });

    }

    static createTeamJob(queue, team, callback) {

        queue.addJob(new TeamJob(team, callback));

    }

    callback(team) {

        this.teamIds.push(team._id);

        this.teamCount++;

        if (this.teamCount === this.comp.numberOfTeams) {

            compRepo.addTeams(this.compDbId, this.teamIds)
                .catch(function (err) {
                    console.error(err);
                });

            let compStandingJob = new CompetitionStandingJob(self.compDbId);
            this.queue.add(compStandingJob);

            let compFixturesJob = new CompetitionFixturesJob(self.compDbId);
            this.queue.add(compFixturesJob);

        }

    }
}