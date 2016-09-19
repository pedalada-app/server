'use strict';

var express = require('express');
var router = express.Router();

var Rx = require('rx');

var factory = require('../../db/src/repositories/factory');

router.post('/fixture/finish', function (req, res, next) {
	let finishedFixtures = req.body.fixtures;

	Rx.Observable.from(finishedFixtures)
		.flatMap(function (fixture) {
			return factory.fixtureToFormsRepo().getByFixtureId(fixture._id)
				.map(function (map) {
					return {
						map: map,
						fixture: fixture
					}
				});
		})
		.flatMap(function (obj) {
			return Rx.Observable.from(obj.map.forms)
				.map(function (form) {
					return {
						form: form,
						fixture: obj.fixture
					}
				});
		})
		.flatMap(function (map) {
			return Rx.Observable.fromPromise(factory.formRepo().getById(map.form.formId, true))
				.map(function (form) {
					return {
						form : form,
						index : map.form.index,
						fixture: map.fixture
					}
				});
		})
		.flatMap(function (obj) {

			//
			//
			//
		})
});


module.exports = router;