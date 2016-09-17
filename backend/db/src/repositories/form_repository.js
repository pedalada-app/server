'use strict';

var factory = require('../models/factory');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

class FormConverter {
	from(obj) {
		return obj;
	}
}

class FormRepository {

	constructor() {
		this.absRep = new AbstractRepository(factory.formModel(), new FormConverter());
	}

	insert(obj) {
		return this.absRep.insert(obj);
	}

	updateStatus(formId, status) {
		return this.absRep.update({_id : id}, repositoryUtils.setFieldValue({status : status}));
	}

	getById(id) {
		return this.absRep.findOne({_id: id}).populate('bets.fixture');
	}

}

module.exports = FormRepository;