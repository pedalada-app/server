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

	standings: [{
		team: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Standings",
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
		},

		wins: {
			type: Number,
			required: true
		},

		draw: {
			type: Number,
			required: true
		},

		losses: {
			type: Number,
			required: true
		},

		homeRecord: {
			goals: {
				type: Number,
				required: true
			},

			goalsAgainst: {
				type: Number,
				required: true
			},

			wins: {
				type: Number,
				required: true
			},

			draw: {
				type: Number,
				required: true
			},

			losses: {
				type: Number,
				required: true
			}
		},
		awayRecord: {
			goals: {
				type: Number,
				required: true
			},

			goalsAgainst: {
				type: Number,
				required: true
			},

			wins: {
				type: Number,
				required: true
			},

			draw: {
				type: Number,
				required: true
			},

			losses: {
				type: Number,
				required: true
			}
		}
	}]

});


module.exports = mongoose.model("Standings", StandingsSchema);