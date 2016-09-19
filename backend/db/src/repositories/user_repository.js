'use strict';

var factory = require('../models/factory');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');


class UserConverter {
	from(obj) {
		return Rx.Observable.just({
			facebookId: obj.id,
			email: obj.emails[0].value,
			name: obj.displayName,
			photoURL: obj.photos[0].value
		})
	}
}

class UserRepository {

	constructor() {
		this.absRep = new AbstractRepository(factory.userModel(), new UserConverter());
	}

	insert(obj) {
		return this.absRep.insert(obj);
	}

	addForm(userId, formId) {
		return this.absRep.update({_id : userId}, {$push : {forms  : formId}})
	}

	getByMail(email) {
		return this.absRep.findOne({email: email}).lean();
	}

	getById(id) {
		return this.absRep.findOne({_id: id}).populate('forms');
	}

}

module.exports = UserRepository;