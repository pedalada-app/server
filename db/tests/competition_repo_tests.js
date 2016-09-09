var chai = require('chai');
var compRepo = require('../repositories/competition_repository');
var mongoose = require('mongoose');
var competiton = require('../models/competition');
var standing = require('../models/standings');

var Rx = require('Rx');

var utils = require('./test_utils')

var expect = chai.expect;

var assertFalse = function () {
    expect(false).to.be.true;
};

var assertComp = function (expected, cb) {
    return function (actual) {
        if (actual) {
            if (expected) {
                expect(actual).name.to.be.equal(expected.name);
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
                expect(actual[0]).position.to.be.equal(expected[0].position);
            }
            cb()
        } else {
            assertFalse();
        }
    }
};

describe('Compatition Repository test', function () {

    beforeEach(function (done) {
        if (mongoose.connection.db) {
            return done();
        }
        mongoose.connect('mongodb://localhost/pedaladaDb', done);
    });

    it('insert', function (done) {

        compRepo.insert(utils.compatitions[0])
            .flatMap(function (obj) {
                return Rx.Observable.fromPromise(competiton.findOne({_id: obj._id}));
            })
            .subscribe(assertComp(utils.compatitions[0], done), function (error) {

                console.error(error);

                assertFalse();
            });

    });

    it('insert many', function (done) {
        compRepo.insertMany(utils.compatitions)
            .flatMap(function (objs) {
                return Rx.Observable.from(objs);
            })
            .flatMap(function (obj) {
                return Rx.Observable.fromPromise(competiton.findOne({_id: obj._id}));
            })
            .subscribe(assertComp(undefined, done), function (error) {

                console.error(error);

                assertFalse();
            });
    });

    it('update standing', function (done) {
        compRepo.insert(utils.compatitions[0])
            .flatMap(function(obj) {
                return compRepo.updateStanding(obj._id, utils.standing);
            })
            .flatMap(function(obj) {
                expect(obj).lastStanding.to.exist;
                return Rx.Observable.fromPromise(standing.findOne({_id: obj.lastStanding}));
            })
            .subscribe(assertStanding(standing, done), function (error) {

                console.error(error);

                assertFalse();
            });

    });

    it('update match day', function (done) {
        done();
    });

    it('add fixtures', function (done) {
        done();
    });

    it('get by api id', function (done) {
        done();
    });

    it('get by id', function (done) {
        done();
    });

    it('id mapping', function (done) {
        done();
    });

});