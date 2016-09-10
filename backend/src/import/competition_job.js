var Client = require('football-api-client')('');

var Rx = require('rx');

var CompRepository = require('dbLib').CompetitionRepository;
var TeamRepository = require('dbLib').TeamRepository;

var compRepo = new CompRepository();
var teamRepo = new TeamRepository();

var CompetitionStandingJob = require('./competition_standings_job');
var CompetitionFixturesJob = require('./competition_fixtures_job');

class CompetitionJob {

    constructor(comp) {
        this.comp = comp;
    }

    start(queue) {

        let self = this;

        self.queue = queue;

        Rx.Observable.fromPromise(Client.getCompetitionById(self.comp.id).getTeams())
            .map(function (res) {
                return res.data.teams;
            })
            .flatMap(function (teams) {
                return teamRepo.insertMany(teams);
            })
            .flatMap(function (teams) {
                self.savedTeamsId = teams.map(function (team) {
                    return team._id;
                });
                return compRepo.insert(self.comp);
            })
            .flatMap(function (comp) {
                self.savedComp = comp;
                return compRepo.addTeams(comp._id, self.savedTeamsId);
            })
            .flatMap(function () {
                return teamRepo.addCompetition(self.savedTeamsId, self.savedComp._id);
            })
            .subscribe(function () {

                let compStandingJob = new CompetitionStandingJob(self.comp._id);
                this.queue.add(compStandingJob);

                let compFixturesJob = new CompetitionFixturesJob(self.comp._id);
                this.queue.add(compFixturesJob);

            }, function (err) {
                console.error(err);
            })


    }

}