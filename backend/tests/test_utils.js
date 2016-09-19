var db = require('../../db/src/main/index');
var modelFactory = require('../db/src/models/factory');
var repoFactory = require('../db/src/repositories/factory');

var userRepo;
var userModel;

module.exports.createUserData = function (done) {

	db.init('mongodb://localhost/pdb-users-test', {
		drop: true
	});

	userRepo = repoFactory.userRepo();

	userModel = modelFactory.userModel();

	done();

};

module.exports.clearUserData = function () {

};


module.exports.exampleUser = {
	id : 123456789,
	emails : [{value : "abc@def.com"}],
	displayName : "Ada Pdea",
	photos : [{value : "http://photo.photo"}]
};

module.exports.exampleForm = {

	bets : [{
		fixture : "57dd12ea873fdc1204c316ad",
		odd : 5,
		bet : 'x'
	}, {
		fixture : "57dd12ea873fdc1204c316ae",
		odd : 10,
		bet : '2'
	}, {
		fixture : "57dd12ea873fdc1204c316af",
		odd : 15,
		bet : '1'
	}],
	pedaladas : 100,
	user : "57dfb4022cd9e81332ce33a3",
	name: "good form",
	expectedWinning: 100*5*10*15

};
