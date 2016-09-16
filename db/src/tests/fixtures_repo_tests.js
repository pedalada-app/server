var chai = require('chai');

var CompetitionRepository = require('../main/repositories/competition_repository');
var TeamRepository = require('../main/repositories/team_repository');
var StandingRepository = require('../main/repositories/standings_repository');
var FixturesRepository = require('../main/repositories/fixture_repository');

var mongoose = require('mongoose');
var fixtures = require('../main/models/fixtures');

var Rx = require('rx');

var utils = require('./test_utils');

var expect = chai.expect;

var compRepo = new CompetitionRepository();
var teamRepo = new TeamRepository();
var standRepo = new StandingRepository();
var fixtRepo = new FixturesRepository();

var assertFalse = function () {
    expect(false).to.be.true;
};

var errorHandler = function (error) {
    console.error(error);
    assertFalse();
};

describe('Fixtures Repository test', function () {

    before(function (done) {
        if (mongoose.connection.db) {
            done();
        }
        mongoose.connect('mongodb://localhost/pedaladaDb-test', done);
    });

    afterEach(function (done) {
        if (mongoose.connection.db) {
            mongoose.connection.db.dropDatabase();
            done();
        }
    });

    after(function (done) {
        if (mongoose.connection.db) {
            mongoose.connection.close();
            done();
        }
    });

    it('insert', function (done) {

        let comp, team1, team2;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insert(utils.teams[0]),
            teamRepo.insert(utils.teams[1]))
            .flatMap(function (arr) {
                comp = arr[0];
                team1 = arr[1];
                team2 = arr[2];
                return fixtRepo.insert(utils.fixtures[0])
            })
            .subscribe(function (fixt) {
                expect(fixt.competitionId.toString()).to.be.equal(comp._id.toString());
                expect(fixt.homeTeam.id.toString()).to.be.equal(team1._id.toString());
                expect(fixt.homeTeam.name).to.be.equal(team1.name);
                expect(fixt.awayTeam.id.toString()).to.be.equal(team2._id.toString());
                expect(fixt.awayTeam.name).to.be.equal(team2.name);
                done();
            }, errorHandler)
    });

    it('update results', function (done) {
        let comp, team1, team2, id;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insert(utils.teams[0]),
            teamRepo.insert(utils.teams[1]))
            .flatMap(function (arr) {
                comp = arr[0];
                team1 = arr[1];
                team2 = arr[2];
                return fixtRepo.insert(utils.fixtures[0])
            })
            .flatMap(function (fixt) {
                id = fixt._id;
                return fixtRepo.updateResult(fixt._id, {goalsHomeTeam : 10, goalsAwayTeam : 0});
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(fixtures.findOne({_id: id}));
            })
            .subscribe(function (fixt) {
                expect(fixt.result.goalsHomeTeam).to.be.equal(10);
                expect(fixt.result.goalsAwayTeam).to.be.equal(0);
                done();
            }, errorHandler);
    });

    it('update status', function (done) {
        let comp, team1, team2, id;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insert(utils.teams[0]),
            teamRepo.insert(utils.teams[1]))
            .flatMap(function (arr) {
                comp = arr[0];
                team1 = arr[1];
                team2 = arr[2];
                return fixtRepo.insert(utils.fixtures[0])
            })
            .flatMap(function (fixt) {
                id = fixt._id;
                return fixtRepo.updateStatus(fixt._id, 'TIMED');
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(fixtures.findOne({_id: id}));
            })
            .subscribe(function (fixt) {
                expect(fixt.status).to.be.equal('TIMED');
                done();
            }, errorHandler);
    });

    it('update date', function (done) {
        let comp, team1, team2, id;
        let date = new Date();

        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insert(utils.teams[0]),
            teamRepo.insert(utils.teams[1]))
            .flatMap(function (arr) {
                comp = arr[0];
                team1 = arr[1];
                team2 = arr[2];
                return fixtRepo.insert(utils.fixtures[0])
            })
            .flatMap(function (fixt) {
                id = fixt._id;
                return fixtRepo.updateDate(fixt._id, date.toString());
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(fixtures.findOne({_id: id}));
            })
            .subscribe(function (fixt) {
                expect(fixt.date.toString()).to.be.equal(date.toString());
                done();
            }, errorHandler);
    });

    it('update odds', function (done) {
        let comp, team1, team2, id;
        let odds = {homeWin : 0.5, awayWin : 0.5, draw : 0.5};

        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insert(utils.teams[0]),
            teamRepo.insert(utils.teams[1]))
            .flatMap(function (arr) {
                comp = arr[0];
                team1 = arr[1];
                team2 = arr[2];
                return fixtRepo.insert(utils.fixtures[0])
            })
            .flatMap(function (fixt) {
                id = fixt._id;
                return fixtRepo.updateOdds(fixt._id, odds);
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(fixtures.findOne({_id: id}));
            })
            .subscribe(function (fixt) {
                expect(fixt.odds.homeWin).to.be.equal(odds.homeWin);
                expect(fixt.odds.awayWin).to.be.equal(odds.awayWin);
                expect(fixt.odds.draw).to.be.equal(odds.draw);
                done();
            }, errorHandler);
    });

    it('get by api id', function (done) {
        let comp, team1, team2, expected;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insert(utils.teams[0]),
            teamRepo.insert(utils.teams[1]))
            .flatMap(function (arr) {
                comp = arr[0];
                team1 = arr[1];
                team2 = arr[2];
                return fixtRepo.insert(utils.fixtures[0])
            })
            .flatMap(function (fixt) {
                expected = fixt;
                return fixtRepo.getByApiId(fixt.api_detail.id);
            })
            .subscribe(function (actual) {
                expect(expected._id.toString).to.be.equal(actual._id.toString);
                expect(expected.competitionId.toString()).to.be.equal(actual.competitionId.toString());
                expect(expected.homeTeam.id.toString()).to.be.equal(actual.homeTeam.id.toString());
                expect(expected.homeTeam.name).to.be.equal(actual.homeTeam.name);
                expect(expected.awayTeam.id.toString()).to.be.equal(actual.awayTeam.id.toString());
                expect(expected.awayTeam.name).to.be.equal(actual.awayTeam.name);
                done();
            }, errorHandler)
    });

    it('get by id', function (done) {
        let comp, team1, team2, expected;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insert(utils.teams[0]),
            teamRepo.insert(utils.teams[1]))
            .flatMap(function (arr) {
                comp = arr[0];
                team1 = arr[1];
                team2 = arr[2];
                return fixtRepo.insert(utils.fixtures[0])
            })
            .flatMap(function (fixt) {
                expected = fixt;
                return fixtRepo.getById(fixt._id);
            })
            .subscribe(function (actual) {
                expect(expected._id.toString).to.be.equal(actual._id.toString);
                expect(expected.competitionId.toString()).to.be.equal(actual.competitionId.toString());
                expect(expected.homeTeam.id.toString()).to.be.equal(actual.homeTeam.id.toString());
                expect(expected.homeTeam.name).to.be.equal(actual.homeTeam.name);
                expect(expected.awayTeam.id.toString()).to.be.equal(actual.awayTeam.id.toString());
                expect(expected.awayTeam.name).to.be.equal(actual.awayTeam.name);
                done();
            }, errorHandler)
    });

    it('id mapping', function (done) {
        let comp, team1, team2, expected;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insert(utils.teams[0]),
            teamRepo.insert(utils.teams[1]))
            .flatMap(function (arr) {
                comp = arr[0];
                team1 = arr[1];
                team2 = arr[2];
                return fixtRepo.insert(utils.fixtures[0])
            })
            .flatMap(function (fixt) {
                expected = fixt._id.toString();
                return fixtRepo.idMapping(fixt.api_detail.id);
            })
            .subscribe(function (actual) {
                expect(expected).to.be.equal(actual.toString());
                done();
            }, errorHandler)
    });

});