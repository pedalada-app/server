var chai = require('chai');
var CompetitionRepository = require('../repositories/competition_repository');
var TeamRepository = require('../repositories/team_repository');
var StandingRepository = require('../repositories/standings_repository');
var mongoose = require('mongoose');
var competiton = require('../models/competition');
var standing = require('../models/standings');

var Rx = require('rx');

var utils = require('./test_utils')

var expect = chai.expect;

var compRepo = new CompetitionRepository();
var teamRepo = new TeamRepository();
var standRepo = new StandingRepository();

var assertFalse = function () {
    expect(false).to.be.true;
};

var assertComp = function (expected, cb) {
    return function (actual) {
        if (actual) {

            if (expected) {
                expect(actual.name).to.be.equal(expected.caption);
            }
            cb()
        } else {
            assertFalse();
        }
    }
};

var assertStanding = function (expected, cb) {
    return function (actual) {
        if (actual) {
            if (expected) {
                expect(actual[0].position).to.be.equal(expected[0].position);
            }
            cb()
        } else {
            assertFalse();
        }
    }
};

var errorHandler = function (error) {
    console.error(error);
    assertFalse();
};

describe('Compatition Repository test', function () {

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

        compRepo.insert(utils.competitions[0])
            .flatMap(function (obj) {
                return Rx.Observable.fromPromise(competiton.findOne({_id: obj._id}));
            })
            .subscribe(assertComp(utils.competitions[0], done), errorHandler);

    });

    it('insert many', function (done) {

        let i = 0;

        compRepo.insertMany(utils.competitions)
            .flatMap(function (objs) {
                return Rx.Observable.from(objs);
            })
            .flatMap(function (obj) {
                return Rx.Observable.fromPromise(competiton.findOne({_id: obj._id}));
            })
            .subscribe(assertComp(undefined, function () {
                if (++i == utils.competitions.length){
                    done()
                }
            }), errorHandler);
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
                return Rx.Observable.fromPromise(competiton.findOne({_id: id}));
            })
            .subscribe(function (comp) {
                expect(comp.lastStanding.toString()).to.be.equal("507f1f77bcf86cd799439011");
                done();
            }, errorHandler);

    });

    it('update match day', function (done) {
        let id;
        compRepo.insert(utils.competitions[0])
            .flatMap(function(comp){
                id = comp._id;
                return compRepo.updateMatchDay(comp._id, 5);
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(competiton.findOne({_id: id}));
            })
            .subscribe(function (comp) {
                expect(comp.currentMatchday).to.be.equal(5);
                done();
            }, errorHandler)
    });

    it('add fixtures', function (done) {
        let id;
        compRepo.insert(utils.competitions[0])
            .flatMap(function(comp){
                id = comp._id;
                return compRepo.addFixtures(comp._id, ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014']);
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(competiton.findOne({_id: id}));
            })
            .subscribe(function (comp) {
                expect(comp.fixtures[0].toString()).to.be.equal('507f1f77bcf86cd799439013');
                expect(comp.fixtures[1].toString()).to.be.equal('507f1f77bcf86cd799439014');
                done();
            }, errorHandler)
    });

    it('add teams', function (done) {
        let id;
        compRepo.insert(utils.competitions[0])
            .flatMap(function(comp){
                id = comp._id;
                return compRepo.addTeams(comp._id, ['507f1f77bcf86cd799439013', '507f1f77bcf86cd799439014']);
            })
            .flatMap(function (status) {
                expect(status.ok).to.be.equal(1);
                expect(status.n).to.be.equal(1);
                return Rx.Observable.fromPromise(competiton.findOne({_id: id}));
            })
            .subscribe(function (comp) {
                expect(comp.teams[0].toString()).to.be.equal('507f1f77bcf86cd799439013');
                expect(comp.teams[1].toString()).to.be.equal('507f1f77bcf86cd799439014');
                done();
            }, errorHandler)
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
            }, errorHandler)
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
            }, errorHandler)
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
            }, errorHandler)
    });

});