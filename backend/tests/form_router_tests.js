"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');

var db = require('../db/index');
var dbConfig = require('../config/db');
var dataDb = require('../../db/src/main/index');

chai.use(chaiHttp);

var should = chai.should();

var www = require("../bin/www");

describe("form router test", function () {

	before(function (done) {
		db.init(dbConfig.userDatabaseUrl_test);
		dataDb.init(dbConfig.dataDatabaseUrl);
		done();
	});

	after(function (done) {
		db.close();
		dataDb.close();
		done();
	});

	var server = "http://localhost:8080";

	it("get forms", function (done) {
		chai.request(server)
			.get('/form')
			.field('userId', '507f1f77bcf86cd799439014')
			.end(function (err, res) {
				console.log(res.body);
				done();
			})
	});

	it("get form by id", function (done) {

		this.timeout(5000);

		chai.request(server)
			.get('/competitions/fixtures/latest')
			.end(function (err, res) {
				res.should.have.status(200);
				res.body.should.be.a('array');
				done();
			})
	});
});