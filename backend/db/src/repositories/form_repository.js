'use strict';

var factory = require('../models/factory');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

var dataModelFactory = require('../../../../db/src/main/models/factory');

class FormConverter {
	from(obj) {
		return Rx.Observable.just(obj);
	}
}

class FormRepository {

	constructor() {
		this.absRep = new AbstractRepository(factory.formModel(), new FormConverter());
	}

	insert(obj) {
		obj.gamesInProgress = obj.bets.length;
		return this.absRep.insert(obj);
	}

	updateStatus(formId, status) {
		return this.absRep.update({_id: formId}, repositoryUtils.setFieldValue({status: status}));
	}

	gameFinished(formId) {
		return this.absRep.update({_id: formId}, {$dec: {gamesInProgress: 1}});
	}

	getById(id, skipPop) {

		var findOne = this.absRep.findOne({_id: id});
		if (!skipPop) {
			findOne = findOne.populate({path: 'bets.fixture', model: dataModelFactory.fixtureModel()});
		}
		return findOne;
	}

}

module.exports = FormRepository;