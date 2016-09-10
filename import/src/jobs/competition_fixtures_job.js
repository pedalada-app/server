let Client = require('football-api-client')('');

let config = require('../config');

let Rx = require('rx');

let FixtureRepository = require(config.dbLib).FixtureRepository;
let CompRepository = require(config.dbLib).CompetitionRepository;
let TeamRepository = require(config.dbLib).TeamRepository;

let fixturesRepo = new FixtureRepository();
let compRepo = new CompRepository();
let teamRepo = new TeamRepository();


class CompetitionFixturesJob {

    constructor(competition) {
        this.competition = competition;
    }

    start(queue) {

        let self = this;

        if (self.matchday > self.competition.currentMatchday) {
            return;
        }

        Rx.Observable.fromPromise(Client.getCompetitionById(self.competition._id)
            .getFixtures())
            .map(function (res) {
                return res.data;
            })
            .flatMap(function (fixtures) {
                return fixturesRepo.insertMany(fixtures);
            })
            .flatMap(function (fixtures) {
                self.savedFixtures = fixtures;
                return competitionRepo.addFixtures(self.comp._id, fixtures);
            })
            .flatMap(function () {

                self.teamToFixturesMap = new Map();

                for (let fixture of self.savedFixtures) {

                    let homeTeam = fixture.homeTeam.id;
                    this.addFixtureToMap(teamToFixturesMap, homeTeam, fixture);

                    let awayTeam = fixture.awayTeam.id;
                    this.addFixtureToMap(teamToFixturesMap, awayTeam, fixture);
                }

                return Rx.Observable.from(self.teamToFixturesMap.keys());

            })
            .flatMap(function (teamId) {

                return teamRepo.addFixtures(teamId, self.teamToFixturesMap[teamId]);

            })
            .subscribe(function () {

            }, function (err) {
                console.error(err);
            }, function () {
                console.log("Saved fixtures for : " + self.competition.name)
            })

    }

    addFixtureToMap(homeTeam, fixture) {
        let homeTeamFixtures = this.teamToFixturesMap[homeTeam] || [];
        homeTeamFixtures.push(fixture._id);
        this.teamToFixturesMap[homeTeam] = homeTeamFixtures;
    }

}

module.exports = CompetitionStandingsJob;