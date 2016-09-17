var chai = require('chai');
var expect = chai.expect;

var TeamRepository = require('../main/repositories/team_repository');
var mongoose = require('mongoose');


var db = require('../main/index');
var factory = require('../main/models/factory');

var Rx = require('rx');

var utils = require('./test_utils');


var teamRepo;

var fixturesModel, teamModel;


describe('team repository tests', function () {

    before(function (done) {

        db.init('mongodb://localhost/pdb-test', {
            drop: true
        });

        teamRepo = new TeamRepository();

        fixturesModel = factory.fixtureModel();
        teamModel = factory.teamModel();

        done();
    });

    afterEach(function (done) {
        db.drop();
        done();
    });

    after(function (done) {
        db.close();
        done();
    });

    it('insert', function (done) {
        teamRepo.insert(utils.pmTeams[0])
            .flatMap(function (team) {
                return Rx.Observable.fromPromise(teamModel.findOne({_id: team._id}));
            })
            .subscribe(function (res) {
                expect(res.name).to.be.equal(utils.pmTeams[0].name);
                expect(res.api_detail.id).to.be.equal(utils.pmTeams[0].id);
                done();
            }, utils.errorHandler);
    });

    it('insert many', function (done) {

        let i = 0;

        teamRepo.insertMany(utils.pmTeams)
            .concatMap(function (objs) {
                return Rx.Observable.from(objs);
            })
            .concatMap(function (team) {
                return Rx.Observable.fromPromise(teamModel.findOne({_id: team._id}));
            })
            .subscribe(function (res) {
                expect(res.name).to.be.equal(utils.pmTeams[i].name);
                expect(res.api_detail.id).to.be.equal(utils.pmTeams[i].id);
                i++;
            }, utils.errorHandler, done);

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
                return Rx.Observable.fromPromise(teamModel.findOne({_id : t._id}));
            })
            .subscribe(function (obj) {
                expect(obj.fixtures[0].toString()).to.be.equal("507f1f77bcf86cd799439011");
            }, utils.errorHandler, done);
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
                return Rx.Observable.fromPromise(teamModel.findOne({_id : t._id}));
            })
            .subscribe(function (obj) {
                expect(obj.competitions[0].toString()).to.be.equal("507f1f77bcf86cd799439011");
            }, utils.errorHandler, done);
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
            }, utils.errorHandler, done);
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
            }, utils.errorHandler, done);
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
            }, utils.errorHandler, done);
    });

});