module.exports.exampleUser = {
	id: 123456789,
	emails: [{value: "abc@def.com"}],
	displayName: "Ada Pdea",
	photos: [{value: "http://photo.photo"}]
};

module.exports.exampleForm = {

	bets: [{
		fixture: "57dd12ea873fdc1204c316ad",
		odd: 5,
		bet: 'x'
	}, {
		fixture: "57dd12ea873fdc1204c316ae",
		odd: 10,
		bet: '2'
	}, {
		fixture: "57dd12ea873fdc1204c316af",
		odd: 15,
		bet: '1'
	}],
	pedaladas: 100,
	user: "57dfbdd14c38de1ab535c308",
	name: "good form",
	expectedWinning: 100 * 5 * 10 * 15

};

module.exports.exampleFixtureToForms = {
	fixtureId: "57dd129135cf8a0e04b80d56",
};

var assertFalse = function () {
	expect(false).to.be.true;
};

module.exports.assertFalse = assertFalse;

module.exports.errorHandler = function (error) {
	console.error(error);
	assertFalse();
};