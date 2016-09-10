var chai = require('chai');
var CompetitionRepository = require('../main/repositories/competition_repository');
var TeamRepository = require('../main/repositories/team_repository');
var StandingRepository = require('../main/repositories/standings_repository');
var FixturesRepository = require('../main/repositories/fixture_repository');
var mongoose = require('mongoose');
var fixtures = require('../main/models/fixtures');
var teams = require('../main/models/teams');


var Rx = require('rx');

var utils = require('./test_utils');

var expect = chai.expect;

var teamRepo = new TeamRepository();

var assertFalse = function () {
    expect(false).to.be.true;
};

var errorHandler = function (error) {
    console.error(error);
    assertFalse();
};

describe('team repository tests', function () {

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
        teamRepo.insert(utils.pmTeams[0])
            .flatMap(function (team) {
                return Rx.Observable.fromPromise(teams.findOne({_id: team._id}));
            })
            .subscribe(function (res) {
                expect(res.name).to.be.equal(utils.pmTeams[0].name);
                expect(res.api_detail.id).to.be.equal(utils.pmTeams[0].id);
                done();
            }, errorHandler);
    });

    it('insert many', function (done) {

        let i = 0;

        teamRepo.insertMany(utils.pmTeams)
            .concatMap(function (objs) {
                return Rx.Observable.from(objs);
            })
            .concatMap(function (team) {
                return Rx.Observable.fromPromise(teams.findOne({_id: team._id}));
            })
            .subscribe(function (res) {
                expect(res.name).to.be.equal(utils.pmTeams[i].name);
                expect(res.api_detail.id).to.be.equal(utils.pmTeams[i].id);
                i++;
            }, errorHandler, done);

        // could fail because of time
    });

    it('add fixtures', function (done) {
        let t;
        teamRepo.insert(utils.pmTeams[0])
            .flatMap(function (team) {
                t = team;
                return teamRepo.addFixtures(team._id, ["507f1f77bcf86cd799439011"])
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(teams.findOne({_id : t._id}));
            })
            .subscribe(function (obj) {
                expect(obj.fixtures[0].toString()).to.be.equal("507f1f77bcf86cd799439011");
            }, errorHandler, done);
    });

    it('add competition', function (done) {
        let t;
        teamRepo.insert(utils.pmTeams[0])
            .flatMap(function (team) {
                t = team;
                return teamRepo.addCompetitions(team._id, ["507f1f77bcf86cd799439011"])
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(teams.findOne({_id : t._id}));
            })
            .subscribe(function (obj) {
                expect(obj.competitions[0].toString()).to.be.equal("507f1f77bcf86cd799439011");
            }, errorHandler, done);
    });

    it('get by api id', function (done) {
        let expected;
        teamRepo.insert(utils.pmTeams[0])
            .flatMap(function (team) {
                expected = team;
                return teamRepo.getByApiId(team.api_detail.id)
            })
            .subscribe(function (actual) {
                expect(expected.name).to.be.equal(actual.name);
                expect(expected.shortName).to.be.equal(actual.shortName);
                expect(expected.squadMarketValue).to.be.equal(actual.squadMarketValue);
            }, errorHandler, done);
    });

    it('get by id', function (done) {
        let expected;
        teamRepo.insert(utils.pmTeams[0])
            .flatMap(function (team) {
                expected = team;
                return teamRepo.getById(team._id)
            })
            .subscribe(function (actual) {
                expect(expected.name).to.be.equal(actual.name);
                expect(expected.shortName).to.be.equal(actual.shortName);
                expect(expected.squadMarketValue).to.be.equal(actual.squadMarketValue);
            }, errorHandler, done);
    });

    it('id mapping', function (done) {
        let expected;
        teamRepo.insert(utils.pmTeams[0])
            .flatMap(function (team) {
                expected = team;
                return teamRepo.idMapping(team.api_detail.id)
            })
            .subscribe(function (actual) {
                expect(expected._id.toString()).to.be.equal(actual.toString());
            }, errorHandler, done);
    });

});