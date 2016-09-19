'use strict';

var formSchema = require('../schema/form');
var usersSchema = require('../schema/user');
var fixtureToFormsSchema = require('../schema/fixture_to_forms');

class Factory {

    constructor() {

    }

    init(connection) {
        this._formModel = connection.model('Form', formSchema);
        this._userModel = connection.model('User', usersSchema);
        this._fixtureToFormsModel = connection.model('Fixture_to_forms', fixtureToFormsSchema);
    }

    formModel() {
        return this._formModel;
    }

    userModel() {
        return this._userModel;
    }

	fixtureToFormsModel() {
		return this._fixtureToFormsModel;
	}

}

module.exports = new Factory();