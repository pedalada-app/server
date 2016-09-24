'use strict';

var Rx = require('rx');

var userDbFactory = require('../../db/src/repositories/factory');
var pusher = require('../tasks/pusher');

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

module.exports = function (finishedFixtures) {

	if(finishedFixtures.length === 0) {
		console.log("no updated fixtures");
		return;
	}

	Rx.Observable.from(finishedFixtures)
		.flatMap(function (fixture) {
			return userDbFactory.fixtureToFormsRepo().getByFixtureId(fixture._id)
				.map(function (map) {
					return {
						map: map,
						fixture: fixture
					}
				});
		})
		.filter(function (obj) {
			return obj.map; // pass only fixtures that have forms
		})
		.filter(function (obj) {
			return (obj.map.status === 'in_progress');
		})
		.doOnNext(function (obj) {
			userDbFactory.fixtureToFormsRepo().markComplete(obj.fixture._id)
				.subscribe(function () {

				})
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
			return Rx.Observable.fromPromise(userDbFactory.formRepo().getByIdSlim(map.form.formId))
				.map(function (form) {
					return {
						form: form,
						index: map.form.index,
						fixture: map.fixture
					}
				});
		})
		.subscribe(function (obj) {
			let form = obj.form;
			let index = obj.index;
			let fixture = obj.fixture;

			// if form is loser already --> do nothing
			if (form.status === 'loser') {
				return;
			}
			// calc new form status according fixture and results
			if (checkBet(fixture.result, form.bets[index].bet)) {
				userDbFactory.formRepo().gameFinished(form._id)
					.then(function () {
						if (form.gamesInProgress === 1) { // the form is a winner
							userDbFactory.userRepo().updatePedaladas(form.user, form.expectedWinning)
								.then(function (status) {
									return userDbFactory.formRepo().updateStatus(form._id, 'winner');
								})
								.then(function (status) {
									pusher.push(form.user, "Congratulations!",
										"You just won " + form.expectedWinning + " pedaladas!!");
								})
								.catch(function (err) {
									console.error(err);
								});
						}
					})
			} else { //this form become a loser
				userDbFactory.formRepo().updateStatus(form._id, 'loser')
					.then(function () {
						pusher.push(form.user, "Bad news!", "Your form just lost. Try your luck again...");
					});
			}
		}, function (err) {
			console.error(err);
		});
};