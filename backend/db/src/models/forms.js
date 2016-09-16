var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var formSchema = new Schema({

	bets: [{
		fixtureId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Fixture",
			required: true
		},

		odd: {
			type: Number,
			required: true
		},

		bet: {
			type: String,
			enum: ['1', '2', 'x']
		}
	}],

	pedaladas: {
		type: Number,
		required: true
	},

	status: {
		type: String,
		enum: ['in-progress', 'winner', 'loser'],
		default: 'in-progress',
		index: true
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	},

	date: {
		type: Number,
		default: Date.now(),
		index: true
	},

	name: {
		type: String,
		required: true
	}

});

module.exports = mongoose.model("Form", formSchema);