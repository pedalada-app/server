'use strict';

var userModel = require('../models/users');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class FormRepository {

	constructor() {
		this.absRep = new AbstractRepository(userModel);
	}

	insert(obj) {
		return this.absRep.insert(obj);
	}

	getById(id) {
		return repositoryUtils.getById(this, id);
	}

}

module.exports = FromRepository;