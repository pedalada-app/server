var chai = require('chai');
var expect = chai.expect;

var db = require('../../index');
var modelFactory = require('../../models/factory');
var repoFactory = require('../../repositories/factory');

var Rx = require('rx');

var utils = require('./test_utils');

var userRepo;
var userModel;

describe('user repository test', function () {

    before(function (done) {

        db.init('mongodb://localhost/pdb-users-test', {
            drop: true
        });

        userRepo = repoFactory.userRepo();

        userModel = modelFactory.userModel();

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
        userRepo.insert(utils.exampleUser)
            .flatMap(function (user) {
                return Rx.Observable.fromPromise(userModel.findOne({_id: user._id}));
            })
            .subscribe(function (actual) {
                expect(actual.name).to.be.equal(utils.exampleUser.displayName);
                expect(actual.facebookId).to.be.equal(utils.exampleUser.id);
                expect(actual.email).to.be.equal(utils.exampleUser.emails[0].value);
                done();
            }, utils.errorHandler);
    });

    it('add form', function (done) {
        let id;
        userRepo.insert(utils.exampleUser)
            .flatMap(function (user) {
                id = user.id;
                return userRepo.addFrom(user._id, "1212121212121212121")
            })
            .subscribe(function (actual) {
                expect(actual.name).to.be.equal(utils.exampleUser.displayName);
                expect(actual.facebookId).to.be.equal(utils.exampleUser.id);
                expect(actual.email).to.be.equal(utils.exampleUser.emails[0].value);
                expect(actual.forms[0].toString()).to.be.equal("1212121212121212121");
                done();
            }, utils.errorHandler);
    });

    it('get by mail', function (done) {
        let id;
        userRepo.insert(utils.exampleUser)
            .flatMap(function (user) {
                id = user.id;
                return userRepo.getByMail(user.email)
            })
            .subscribe(function (actual) {
                expect(actual._id.toString()).to.be.equal(id);
                done();
            }, utils.errorHandler);
    });

    it('get by id', function (done) {
        let expected;
        userRepo.insert(utils.exampleUser)
            .flatMap(function (user) {
                expected = user;
                return userRepo.getById(user._id)
            })
            .subscribe(function (actual) {
                expect(actual.name).to.be.equal(expected.name);
                expect(actual.facebookId).to.be.equal(expected.facebookId);
                expect(actual.email).to.be.equal(expected.email);
                done();
            }, utils.errorHandler);
    });

});