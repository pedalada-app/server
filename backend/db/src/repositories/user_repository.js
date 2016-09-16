'use strict';

var userModel = require('../models/users');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class UserRepository {

	constructor() {
		this.absRep = new AbstractRepository(userModel);
	}

	insert(obj) {
		return this.absRep.insert(obj);
	}

	addFrom(userId, formId) {
		return this.absRep.update({_id : userId}, {$push : {forms  : formId}})
	}

	getByMail(email) {
		return this.absRep.findOne({email: email}).lean();
	}

	getById(id) {
		return repositoryUtils.getById(this, id);
	}

}

module.exports = UserRepository;