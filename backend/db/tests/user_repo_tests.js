'use strict'

var chai = require('chai');
var expect = chai.expect;

var db = require('../index');
var modelFactory = require('../src/models/factory');
var repoFactory = require('../src/repositories/factory');

var dbConfig = require('../../config/db');

var Rx = require('rx');

var utils = require('./test_utils');

var userRepo;
var userModel;

describe('user repository test', function () {

	before(function (done) {

		db.init(dbConfig.userDatabaseUrl);

		// db.init('mongodb://localhost/pdb-users-test', {
		// 	drop: true
		// });

		userRepo = repoFactory.userRepo();

		userModel = modelFactory.userModel();

		done();
	});

	// afterEach(function (done) {
	// 	db.drop();
	// 	done();
	// });
	//
	// after(function (done) {
	// 	db.close();
	// 	done();
	// });

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
		let expected;
		userRepo.insert(utils.exampleUser)
			.flatMap(function (user) {
				expected = user;
				return userRepo.addForm(user._id, "57dfbe400522891b01c0a0d8")
			})
			.subscribe(function (status) {
				expect(status.ok).to.be.equal(1);
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