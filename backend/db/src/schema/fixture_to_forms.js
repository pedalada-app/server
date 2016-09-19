var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fixtureToFormSchema = new Schema({

	fixtureId : {
		type: mongoose.Schema.Types.ObjectId,
		id: true
	},

	forms : [{
		formId : {
			type: mongoose.Schema.Types.ObjectId,
			ref:"From",
			request:true
		},
		index: {
			type: Number,
			required: true
		}
	}],

	status: {
		type: String,
		enum: ['in_progress', 'complete'],
		default: 'in_progress'
	}
});

module.exports = fixtureToFormSchema;
