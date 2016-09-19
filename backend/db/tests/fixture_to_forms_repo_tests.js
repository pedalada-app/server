'use strict'

var chai = require('chai');
var expect = chai.expect;

var db = require('../index');
var modelFactory = require('../src/models/factory');
var repoFactory = require('../src/repositories/factory');

var dbConfig = require('../../config/db');

var Rx = require('rx');

var utils = require('./test_utils');

var fixtureToFormsRepo;
var fixtureToFormsModel;

describe('fixture to forms tests', function (done) {

	before(function (done) {

		db.init(dbConfig.userDatabaseUrl_test);

		fixtureToFormsRepo = repoFactory.fixtureToFormsRepo();

		fixtureToFormsModel = modelFactory.fixtureToFormsModel();

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

	it('map form', function (done) {
		fixtureToFormsRepo.mapForm(utils.exampleFixtureToForms.fixtureId, "57dfbe400522891b01c0a0d8", 0)
			.subscribe(function (obj) {
				console.log(obj);
				expect(obj.ok).to.be.equal(1);
				done();
			}, utils.errorHandler);

	});

	it('get by fixture id', function (done) {
		fixtureToFormsRepo.getByFixtureId(utils.exampleFixtureToForms.fixtureId)
			.subscribe(function (obj) {
				expect(obj.fixtureId.toString()).to.be.equal(utils.exampleFixtureToForms.fixtureId);
				expect(obj.forms).to.be.a.array;
				done();
			}, utils.errorHandler);
	});

	it('mark complete', function (done) {

		this.timeout(4000);

		fixtureToFormsRepo.markComplete(utils.exampleFixtureToForms.fixtureId)
			.flatMap(function (status) {
				expect(status.ok).to.be.equal(1);
				return fixtureToFormsRepo.getByFixtureId(utils.exampleFixtureToForms.fixtureId)
			})
			.subscribe(function (obj) {
				expect(obj.status).to.be.equal('complete');
				done();
			}, utils.errorHandler);
	});

});
