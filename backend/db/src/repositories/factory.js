
var FormRepository = require('./form_repository');
var UserRepository = require('./user_repository');

class Factory {

    constructor() {

    }

    init() {
        this._formRepo = new FormRepository();
        this._userRepo = new UserRepository();
    }

    formRepo() {
        return this._formRepo;
    }

    userRepo() {
        return this._userRepo;
    }

}

module.exports = new Factory();