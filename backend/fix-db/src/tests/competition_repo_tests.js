
var db = require('../main/index');
var modelFactory = require('../main/models/factory');
var repoFactory = require('../main/repositories/factory');

var Rx = require('rx');

var utils = require('./test_utils');

var chai = require('chai');
var expect = chai.expect;

var compRepo, teamRepo, standRepo;
var competitionModel;

describe('Compatition Repository test', function () {

    before(function (done) {

        db.init('mongodb://localhost/pdb-test', {
            drop: true
        });

        compRepo = repoFactory.competitionRepo();
        teamRepo = repoFactory.teamRepo();
        standRepo = repoFactory.standingsRepo();

        competitionModel = modelFactory.competitionModel();

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

        compRepo.insert(utils.competitions[0])
            .flatMap(function (obj) {
                return Rx.Observable.fromPromise(competitionModel.findOne({_id: obj._id}));
            })
            .subscribe(utils.assertComp(utils.competitions[0], done), utils.errorHandler);

    });

    it('insert many', function (done) {

        let i = 0;

        compRepo.insertMany(utils.competitions)
            .flatMap(function (objs) {
                return Rx.Observable.from(objs);
            })
            .flatMap(function (obj) {
                return Rx.Observable.fromPromise(competitionModel.findOne({_id: obj._id}));
            })
            .subscribe(utils.assertComp(undefined, function () {
                if (++i == utils.competitions.length) {
                    done()
                }
            }), utils.errorHandler);
    });

    it('update standing', function (done) {
        let id;
        compRepo.insert(utils.competitions[0])
            .flatMap(function (comp) {
                id = comp._id;
                return compRepo.updateStanding(comp._id, "507f1f77bcf86cd799439011")
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(competitionModel.findOne({_id: id}));
            })
            .subscribe(function (comp) {

                console.log(comp);

                expect(comp.lastStanding.toString()).to.be.equal("507f1f77bcf86cd799439011");
                expect(comp.name).to.be.equal(utils.competitions[0].caption);
                done();
            }, utils.errorHandler);

    });

    it('update match day', function (done) {
        let id;
        compRepo.insert(utils.competitions[0])
            .flatMap(function (comp) {
                id = comp._id;
                return compRepo.updateMatchDay(comp._id, 5);
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(competitionModel.findOne({_id: id}));
            })
            .subscribe(function (comp) {
                expect(comp.currentMatchday).to.be.equal(5);
                expect(comp.name).to.be.equal(utils.competitions[0].caption);
                done();
            }, utils.errorHandler)
    });

    it('add fixtures', function (done) {
        let id;
        compRepo.insert(utils.competitions[0])
            .flatMap(function (comp) {
                id = comp._id;
                return compRepo.addFixtures(comp._id, ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014']);
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(competitionModel.findOne({_id: id}));
            })
            .subscribe(function (comp) {
                expect(comp.fixtures[0].toString()).to.be.equal('507f1f77bcf86cd799439013');
                expect(comp.fixtures[1].toString()).to.be.equal('507f1f77bcf86cd799439014');
                done();
            }, utils.errorHandler)
    });

    it('add teams', function (done) {
        let id;
        compRepo.insert(utils.competitions[0])
            .flatMap(function (comp) {
                id = comp._id;
                return compRepo.addTeams(comp._id, ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014']);
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(competitionModel.findOne({_id: id}));
            })
            .subscribe(function (comp) {
                expect(comp.teams[0].toString()).to.be.equal('507f1f77bcf86cd799439013');
                expect(comp.teams[1].toString()).to.be.equal('507f1f77bcf86cd799439014');
                done();
            }, utils.errorHandler)
    });

    it('get by api id', function (done) {
        let expected;
        compRepo.insert(utils.competitions[0])
            .flatMap(function (obj) {
                expected = obj;
                return compRepo.getByApiId(obj.api_detail.id)
            })
            .subscribe(function (actual) {
                expect(actual.name).to.be.equal(expected.name);
                expect(actual.leagueCode).to.be.equal(expected.leagueCode);
                expect(actual._id.toString()).to.be.equal(expected._id.toString());
                done();
            }, utils.errorHandler)
    });

    it('get by id', function (done) {
        let expected;
        compRepo.insert(utils.competitions[0])
            .flatMap(function (obj) {
                expected = obj;
                return compRepo.getById(obj._id)
            })
            .subscribe(function (actual) {
                expect(actual.name).to.be.equal(expected.name);
                expect(actual.leagueCode).to.be.equal(expected.leagueCode);
                expect(actual._id.toString()).to.be.equal(expected._id.toString());
                done();
            }, utils.errorHandler)
    });

    it('id mapping', function (done) {
        let expected;
        compRepo.insert(utils.competitions[0])
            .flatMap(function (obj) {
                expected = obj;
                return compRepo.idMapping(obj.api_detail.id)
            })
            .subscribe(function (actual) {
                expect(actual.toString()).to.be.equal(expected._id.toString());
                done();
            }, utils.errorHandler)
    });

});