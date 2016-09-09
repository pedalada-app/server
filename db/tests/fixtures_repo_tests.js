var chai = require('chai');
var CompetitionRepository = require('../repositories/competition_repository');
var TeamRepository = require('../repositories/team_repository');
var StandingRepository = require('../repositories/standings_repository');
var FixturesRepository = require('../repositories/fixture_repository');
var mongoose = require('mongoose');
var competiton = require('../models/competition');
var fixtures = require('../models/fixtures');
var standing = require('../models/standings');

var Rx = require('rx');

var utils = require('./test_utils')

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
        errorHandler("Not implemented yet");
    });

    it('update date', function (done) {
        errorHandler("Not implemented yet");
    });

    it('update odds', function (done) {
        errorHandler("Not implemented yet");
    });

    it('get by api id', function (done) {
        errorHandler("Not implemented yet");
    });

    it('get by id', function (done) {
        errorHandler("Not implemented yet");
    });

    it('id mapping', function (done) {
        errorHandler("Not implemented yet");
    });

});