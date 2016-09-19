'use strict';

var FormRepository = require('./form_repository');
var UserRepository = require('./user_repository');
var FixtureToFormsRepository = require('./fixture_to_forms_repository');

class Factory {

    constructor() {

    }

    init() {
        this._formRepo = new FormRepository();
        this._userRepo = new UserRepository();
        this._fixtureToFormsRepo = new FixtureToFormsRepository();
    }

    formRepo() {
        return this._formRepo;
    }

    userRepo() {
        return this._userRepo;
    }

	fixtureToFormsRepo() {
		return this._fixtureToFormsRepo;
	}

}

module.exports = new Factory();