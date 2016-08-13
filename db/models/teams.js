var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var TeamSchema = new Schema({

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

	shortName: {
		type: String,
        required: true
	},

	competitions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Competition"
	}],

	fixtures: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Fixtures"
	}],

	crestUrl: {
		type: String
	}

});


module.exports = mongoose.model("Team", TeamSchema);