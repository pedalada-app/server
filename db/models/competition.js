var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CompetitionSchema = new Schema({

	api_detail: {
		id: {
			type: Number,
			index: true
		}
	},

	name: {
		type: String
	},

	leagueCode: {
		type: String
	},

	year: {
		type: String
	},

	currentMatchday: {
		type: Number
	},

	numberOfMatchdays: {
		type: Number
	},

	standings: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Standings"
	}],

	teams: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Teams"
	}]

});


module.exports = mongoose.model("Competition", CompetitionSchema);