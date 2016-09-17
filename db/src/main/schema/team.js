var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TeamSchema = new Schema({

	api_detail: {
		id: {
			type: Number,
			index: true,
            required: true,
			unique: true
		}
	},

	name: {
		type: String,
        required: true
	},

	shortName: {
		type: String,
        required: true
	},

	squadMarketValue: {
		type: String
	},

	competitions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Competition"
	}],

	fixtures: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Fixture"
	}],

	crestUrl: {
		type: String
	}

});

module.exports = TeamSchema;