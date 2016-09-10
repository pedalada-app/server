let config = require('../config');

let Client = require('football-api-client')(config.apiKey);

let Rx = require('rx');

let CompRepository = require(config.dbLib).CompetitionRepository;
let TeamRepository = require(config.dbLib).TeamRepository;

let compRepo = new CompRepository();
let teamRepo = new TeamRepository();

let CompetitionStandingJob = require('./competition_standings_job');
let CompetitionFixturesJob = require('./competition_fixtures_job');

class CompetitionJob {

    constructor(comp) {
        this.comp = comp;
    }

    start(queue) {

        let self = this;

        self.queue = queue;

        console.log("Competition job: " + self.comp.caption);

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

                return teamRepo.addCompetitions(self.savedTeamsId, [self.savedComp._id]);
            })
            .subscribe(function () {

                let compStandingJob = new CompetitionStandingJob(self.savedComp);
                self.queue.addJob(compStandingJob);

                // let compFixturesJob = new CompetitionFixturesJob(self.savedComp);
                // self.queue.addJob(compFixturesJob);

            }, function (err) {
                console.error(err);
            }, function () {
                console.log("Finished");
            })


    }

}

module.exports = CompetitionJob;