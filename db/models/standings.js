var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var StandingsSchema = new Schema({

	compId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Competition"
	},

	matchday: {
		type: Number
	},

	standings: [{
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Standings"
		},
		playedGames: {
			type: Number
		},
		points: {
			type: Number
		},
		goals: {
			type: Number
		},
		goalsAgainst: {
			type: Number
		},
		wins: {
			type: Number
		},
		draw: {
			type: Number
		},
		losses: {
			type: Number
		},
		homeRecord: {
			goals: {
				type: Number
			},
			goalsAgainst: {
				type: Number
			},
			wins: {
				type: Number
			},
			draw: {
				type: Number
			},
			losses: {
				type: Number
			}
		},
		awayRecord: {
			goals: {
				type: Number
			},
			goalsAgainst: {
				type: Number
			},
			wins: {
				type: Number
			},
			draw: {
				type: Number
			},
			losses: {
				type: Number
			}
		}
	}]

});


module.exports = mongoose.model("Standings", StandingsSchema);