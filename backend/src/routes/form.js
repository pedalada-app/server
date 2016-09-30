'use strict';

var express = require('express');
var router = express.Router();
var utils = require('./router_utils');

var config = require('../../config/auth'); // get our config file

var factory = require('../../db/src/repositories/factory');

var db = require('../../db/index');


var generateReturnForm = function (form) {
	let returnForm = {};
	returnForm.bets = [];
	for (let bet of form.bets) {
		let fixture = bet.fixture;
		returnForm.bets.push({
			bet: bet.bet,
			fixture: {
				homeTeam: {
					name: fixture.homeTeam.name,
					id: fixture.homeTeam.id
				},
				awayTeam: {
					name: fixture.awayTeam.name,
					id: fixture.awayTeam.id
				},
				gameStatus: fixture.status,
				result: fixture.results,
				date: fixture.date,
				status: fixture.status,
				odds: fixture.odds
			},
		});
	}
	returnForm.name = form.name;
	returnForm.pedaladas = form.pedaladas;
	returnForm.expectedWinning = form.expectedWinning;
	returnForm.status = form.status;
	returnForm.date = form.date;

	return returnForm;
};

// check if pass authentication
router.use(function (req, res, next) {
	if (req.authenticate.error) {
		console.error(req.authenticate.error);
		res.status(401);
		res.json({msg: "authentication failed", error: req.authenticate.error})
	} else {
		req.userId = req.authenticate.decoded;
		next();
	}
});


// get form
router.get('/:formId', function (req, res) {


	let formId = req.params.formId;

	factory.formRepo().getById(formId)
		.then(function (form) {

			res.status(200);
			res.json(generateReturnForm(form));
		})
		.catch(utils.errorHandler(res))
});

// get user's forms
router.get('/', function (req, res, next) {

	let userId = req.userId;
	console.log(userId);
	factory.userRepo().getById(userId)
		.then(function (user) {
			let returnForms = [];
			for (let form of user.forms) {
				returnForms.push({
					id: form._id,
					name: form.name,
					pedaladas: form.pedaladas,
					expectedWinning: form.expectedWinning,
					status: form.status
				});
			}
			res.status(200);
			res.json(returnForms);
		})
		.catch(utils.errorHandler(res))
});


// submit new form
router.post('/', function (req, res, next) {
	let userId = req.userId;
	let newForm = req.body;
	let id;
	newForm.user = userId;
	factory.formRepo().insert(newForm)
		.flatMap(function (form) {
			id = form._id;
			return factory.userRepo().addForm(userId, form._id, form.pedaladas)
		})
		.doOnNext(function () {
			for (let i = 0; i < newForm.bets.length; ++i) {
				var fixtureId = newForm.bets[i].fixture;
				factory.fixtureToFormsRepo().mapForm(fixtureId, id, i)
					.subscribe(function () {

					});
			}
		})
		.subscribe(function (status) {
			if (status.ok === 1) {
				res.status(200);
				res.json({id: id})
			} else {
				res.status(500);
				res.json({status: 500, msg: "cant add form to user"})
			}
		}, utils.errorHandler(res))

});

module.exports = router;