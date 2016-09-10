let Client = require('football-api-client')('');

let config = require('../config');

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
                return teamRepo.addCompetitions(self.savedTeamsId, self.savedComp._id);
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