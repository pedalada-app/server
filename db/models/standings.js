var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StandingsSchema = new Schema({

	compId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Competition",
		index: true,
		required: true
	},

	matchday: {
		type: Number,
		index: true,
		required: true
	},

	standing: [{
		teamId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Team",
			required: true
		},

		name: {
			type: String,
			required: true
		},

		playedGames: {
			type: Number,
			required: true
		},

		points: {
			type: Number,
			required: true
		},

		goals: {
			type: Number,
			required: true
		},

		goalsAgainst: {
			type: Number,
			required: true
		}
	}]

});


module.exports = mongoose.model("Standings", StandingsSchema);