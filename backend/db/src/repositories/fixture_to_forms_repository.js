'use strict';

var factory = require('../models/factory');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');


class FixtureToFormsConverter {
	from(obj) {
		return Rx.Observable.just(obj)
	}
}

class FixtureToFormsRepository {

	constructor() {
		this.absRep = new AbstractRepository(factory.fixtureToFormsModel(), new FixtureToFormsConverter());
	}

	mapForm(fixtureId, formId, index) {
		return Rx.Observable.fromPromise(this.absRep.update({fixtureId: fixtureId}, {$push: {forms: {
			formIf: formId,
			index: index}
		}}, {
			upsert: true
		}));
	}

	getByFixtureId(fixtureId) {
		return Rx.Observable.fromPromise(this.absRep.findOne({fixtureId: fixtureId}));
	}

	markComplete(fixtureId) {
		return Rx.Observable.fromPromise(this.absRep.update({fixtureId: fixtureId}, {status : 'complete'}));
	}

}

module.exports = FixtureToFormsRepository;
