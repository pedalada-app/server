'use strict';

var formSchema = require('../schema/form');
var usersSchema = require('../schema/user');


class Factory {

    constructor() {

    }

    init(connection) {
        this._formModel = connection.model('Form', formSchema);
        this._userModel = connection.model('User', usersSchema);
    }

    formModel() {
        return this._formModel;
    }

    userModel() {
        return this._userModel;
    }

}

module.exports = new Factory();