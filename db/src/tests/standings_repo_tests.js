var chai = require('chai');
var expect = chai.expect;

var CompetitionRepository = require('../main/repositories/competition_repository');
var TeamRepository = require('../main/repositories/team_repository');
var StandingRepository = require('../main/repositories/standings_repository');

var mongoose = require('mongoose');

var Rx = require('rx');

var utils = require('./test_utils');

var db = require('../main/index');
var factory = require('../main/models/factory');

var compRepo, teamRepo, standRepo;

var fixtureModel, standingModel;

describe('standing repository tests', function () {

    before(function (done) {

        db.init('mongodb://localhost/pdb-test', {
            drop: true
        });

        compRepo = new CompetitionRepository();
        teamRepo = new TeamRepository();
        standRepo = new StandingRepository();

        fixtureModel = factory.fixtureModel();
        standingModel = factory.standingsModel();

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

        let comp, teams;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insertMany(utils.pmTeams))
            .flatMap(function (arr) {
                comp = arr[0];
                teams = arr[1];
                return standRepo.insert(utils.standing)
            })
            .subscribe(function (stand) {
                expect(stand.compId.toString()).to.be.equal(comp._id.toString());
                expect(stand.matchday).to.be.equal(utils.standing.matchday);
                expect(stand.standing[0].name).to.be.equal('ManCity');
                done();
            }, utils.errorHandler)
    });

    it('remove standing', function (done) {
        let comp, teams, id;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insertMany(utils.pmTeams))
            .flatMap(function (arr) {
                comp = arr[0];
                teams = arr[1];
                return standRepo.insert(utils.standing)
            })
            .flatMap(function (stand) {
                id = stand._id;
                return standRepo.removeStanding(stand._id);
            })
            .flatMap(function (status) {
                expect(status.result.ok).to.be.equal(1);
                expect(status.result.n).to.be.equal(1);
                return Rx.Observable.fromPromise(standingModel.findOne({_id: id}));
            })
            .subscribe(function (obj) {
                expect(obj).to.be.null;
                done();
            }, utils.errorHandler)
    });

    it('get by id', function (done) {
        let comp, teams, expected;
        Rx.Observable.zip(compRepo.insert(utils.competitions[0]),
            teamRepo.insertMany(utils.pmTeams))
            .flatMap(function (arr) {
                comp = arr[0];
                teams = arr[1];
                return standRepo.insert(utils.standing)
            })
            .flatMap(function (stand) {
                expected = stand;
                return standRepo.getById(stand._id);
            })
            .subscribe(function (actual) {
                expect(expected.compId.toString()).to.be.deep.equal(actual.compId.toString());
                expect(expected.matchday).to.be.deep.equal(actual.matchday);
                expect(expected.standing[0].teamId.toString()).to.be.deep.equal(actual.standing[0].teamId.toString());
                expect(expected.standing[1].teamId.toString()).to.be.deep.equal(actual.standing[1].teamId.toString());
                expect(expected.standing[2].teamId.toString()).to.be.deep.equal(actual.standing[2].teamId.toString());
                done();
            }, utils.errorHandler)
    });

});