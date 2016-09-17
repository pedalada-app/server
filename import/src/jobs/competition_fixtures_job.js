let config = require('../config');

let Client = require('football-api-client')(config.apiKey);

let Rx = require('rx');

let FixtureRepository = require(config.dbLib).FixtureRepository;
let CompRepository = require(config.dbLib).CompetitionRepository;
let TeamRepository = require(config.dbLib).TeamRepository;

let fixturesRepo;
let compRepo;
let teamRepo;


class CompetitionFixturesJob {

    static init() {
        fixturesRepo = new FixtureRepository();
        compRepo = new CompRepository();
        teamRepo = new TeamRepository();
    }

    constructor(competition) {
        this.competition = competition;
    }

    start() {

        let self = this;

        console.log("Competition fixtures job" + JSON.stringify(self.competition));

        Rx.Observable.fromPromise(Client.getCompetitionById(self.competition.api_detail.id)
            .getFixtures())
            .map(function (res) {
                return res.data.fixtures;
            })
            .flatMap(function (fixtures) {
                return fixturesRepo.insertMany(fixtures);
            })
            .flatMap(function (fixtures) {
                self.savedFixtures = fixtures;
                return compRepo.addFixtures(self.competition._id, fixtures);
            })
            .flatMap(function () {

                self.teamToFixturesMap = {};

                for (let fixture of self.savedFixtures) {

                    let homeTeam = fixture.homeTeam.id;
                    self.addFixtureToMap(homeTeam, fixture);

                    let awayTeam = fixture.awayTeam.id;
                    self.addFixtureToMap(awayTeam, fixture);
                }

                return Rx.Observable.from(Object.keys(self.teamToFixturesMap));

            })
            .filter(function (key) {
                return self.teamToFixturesMap.hasOwnProperty(key);
            })
            .flatMap(function (teamId) {

                return teamRepo.addFixtures([teamId], self.teamToFixturesMap[teamId]);

            })
            .subscribe(function () {
            }, function (err) {
                console.error(err);
            }, function () {
                console.log("Saved fixtures for : " + self.competition.name)
            })

    }

    addFixtureToMap(team, fixture) {
        let fixtures = this.teamToFixturesMap[team] || [];
        fixtures.push(fixture._id);
        this.teamToFixturesMap[team] = fixtures;
    }

}

module.exports = CompetitionFixturesJob;