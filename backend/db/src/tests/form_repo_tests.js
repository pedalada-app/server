var chai = require('chai');
var expect = chai.expect;

var db = require('../../index');
var modelFactory = require('../../models/factory');
var repoFactory = require('../../repositories/factory');

var Rx = require('rx');

var utils = require('./test_utils');

var formRepo;
var formModel;

describe('form repository test', function () {

    before(function (done) {

        db.init('mongodb://localhost/pdb-users-test', {
            drop: true
        });

        formRepo = repoFactory.formRepo();

        formModel = modelFactory.formModel();

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
        formRepo.insert(utils.exampleForm)
            .flatMap(function (form) {
                return Rx.Observable.fromPromise(formModel.findOne({_id: form._id}));
            })
            .subscribe(function (actual) {
                expect(actual.name).to.be.equal(utils.exampleForm.name);
                expect(actual.bets.length).to.be.equal(utils.bets.length);
                expect(actual.status).to.be.equal('in-progress');
                done();
            }, utils.errorHandler);
    });

    it('update status', function (done) {
        let id;
        formRepo.insert(utils.exampleForm)
            .flatMap(function (form) {
                id = form._id;
                return formRepo.updateStatus(id, "winner")
            })
            .flatMap(function (form) {
                return Rx.Observable.fromPromise(formModel.findOne({_id: id}));
            })
            .subscribe(function (actual) {
                expect(actual.status).to.be.equal('winner');
                done();
            }, utils.errorHandler);
    });

    it('get by id', function (done) {
        let expected;
        formRepo.insert(utils.exampleForm)
                expected = form;
                return formRepo.getById(user._id)
            })
            .subscribe(function (actual) {
                expect(actual.name).to.be.equal(expected.name);
                expect(actual.date).to.be.equal(expected.date);
                expect(actual.expectedWinning).to.be.equal(expected.expectedWinning);
                done();
            }, utils.errorHandler);
    });

});