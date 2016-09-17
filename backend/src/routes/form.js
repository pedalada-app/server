var express = require('express');
var router = express.Router();
var utils = require('./router_utils');

var config = require('../../config/auth'); // get our config file

var factory = require('../../db/src/repositories/factory');
var formRepo = factory.formRepo();
var userRepo = factory.userRepo();


var db = require('../../db/index');

// check if pass authentication
router.use(function (req, res, next) {
	if (req.authenticate.error) {
		console.error(req.authenticate.error);
		res.status(401);
		res.json({msg: "authentication failed", error: req.authenticate.error})
	} else {
		res.userId = res.authenticate.decoded;
		next();
	}
});

var generateReturnForm = function (form) {
	let returnForm = {};
	returnForm.fixtures = [];
	for (let bet of form.bets) {
		let fixture = bet.fixture;
		returnForm.fixtures.push({
			homeTeam: {
				name: fixture.homeTeam.name,
				id: fixture.homeTeam.id
			},
			awayTeam: {
				name: fixture.awayTeam.name,
				id: fixture.awayTeam.id
			},
			odd: bet.odd,
			bet: bet.bet,
			gameStatus: fixture.status,
			result: fixture.results,
			date: fixture.date
		});
	}
	returnForm.name = form.name;
	returnForm.pedaladas = form.pedaladas;
	returnForm.expectedWinning = form.expectedWinning;
	returnForm.status = form.status;
	returnForm.date = form.date;

	return returnForm;
};

// get user's forms
router.get(function (req, res, next) {
	let userId = req.userId;
	userRepo.getById(userId)
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

// get form
router.get('/:formId', function (req, res, next) {
	let formId = req.params.formId;
	formRepo.getById(formId)
		.then(function (form) {
			res.status(200);
			res.json(generateReturnForm(form));
		})
		.catch(utils.errorHandler(res))
});