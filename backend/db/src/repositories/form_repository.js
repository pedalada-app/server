'use strict';

var userModel = require('../models/users');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class FormConverter {
	from(obj) {
		return obj;
	}
}

class FormRepository {

	constructor() {
		this.absRep = new AbstractRepository(userModel, new FormConverter());
	}

	insert(obj) {
		return this.absRep.insert(obj);
	}

	updateStarus(formId, status) {
		return this.absRep.update({_id : id}, repositoryUtils.setFieldValue({status : status}));
	}

	getById(id) {
		return this.absRep.findOne({_id: id}).populate('bets.fixture');
	}

}

module.exports = FormRepository;