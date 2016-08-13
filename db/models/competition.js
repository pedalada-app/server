var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var CompetitionSchema = new Schema({

	api_detail: {
		id: {
			type: Number,
			index: true,
			required: true
		}
	},

	name: {
		type: String,
		required: true
	},

	leagueCode: {
		type: String,
		required: true
	},

	year: {
		type: String,
		required: true
	},

	currentMatchday: {
		type: Number,
		default: 1
	},

	numberOfMatchdays: {
		type: Number,
		required: true
	},

	lastStanding: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Standings"
	},

	fixtures: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Fixtures"
	}],

	teams: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Teams"
	}]

});


module.exports = mongoose.model("Competition", CompetitionSchema);