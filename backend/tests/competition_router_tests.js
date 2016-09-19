"use strict";

var chai = require('chai');
var chaiHttp = require('chai-http');

var db = require('../db/index');
var dbConfig = require('../config/db');
var dataDb = require('../../db/src/main/index');

chai.use(chaiHttp);

var should = chai.should();

var www = require("../bin/www");

describe("competition router test", function () {

	before(function (done) {
		dataDb.init(dbConfig.dataDatabaseUrl);
		done();
	});

	after(function (done) {
		dataDb.close();
		done();
	});

	var server = "http://localhost:8080";

	it("get competitions", function (done) {
		chai.request(server)
			.get('/competitions')
			.end(function (err, res) {
				res.should.have.status(200);
				res.body.should.be.a('array');
				done();
			})
	});

	it("get latest fixtures", function (done) {

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
