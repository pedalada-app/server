'use strict';

var express = require('express');
var router = express.Router();

var Rx = require('rx');

var userDbFactory = require('../../db/src/repositories/factory');
var dataDbFactory = require('../../../db/src/main/repositories/factory');

var checkBet = function (result, bet) {
	if ((result.goalsHomeTeam > result.goalsAwayTeam) && bet === '1') {
		return true;
	}
	if ((result.goalsHomeTeam < result.goalsAwayTeam) && bet === '2') {
		return true;
	}
	if ((result.goalsHomeTeam === result.goalsAwayTeam) && bet === 'x') {
		return true;
	}
	return false;
};

router.post('/fixture/finish', function (req, res, next) {
	let finishedFixtures = req.body.fixtures;

	Rx.Observable.from(finishedFixtures)
		.flatMap(function (fixture) {
			return dataDbFactory.fixtureToFormsRepo().getByFixtureId(fixture._id)
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
			return Rx.Observable.fromPromise(dataDbFactory.formRepo().getById(map.form.formId, true))
				.map(function (form) {
					return {
						form : form,
						index : map.form.index,
						fixture: map.fixture
					}
				});
		})
		.flatMap(function (obj) {
			let form = obj.form;
			let index = obj.index;
			let fixture = obj.fixture;

			// if form is loser already --> do nothing
			if (form.status === 'loser') {
				return;
			}
			// calc new form status according fixture and results
			if(checkBet(fixture.status, form.bets[index].bet)) {
				userDbFactory.formRepo().gameFinished(form._id)
					.then(function (status) {
						if (form.gamesInProgress === 1) { // the form is a winner.
							return userDbFactory.userRepo().updatePedaladas(form.user, form.expectedWinning);
						}
					})
					.then(function () {
						return userDbFactory.formRepo().updateStatus(form._id, 'winner');
					})
					.then(function () {
						// send msg via GCM
					});
			} else { //this form become a loser
				userDbFactory.formRepo().updateStatus(form._id, 'loser')
					.then(function () {
						// sent msg via GCM
					});
			}
		});
});


module.exports = router;