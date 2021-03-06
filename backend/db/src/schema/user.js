var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({

	facebookId: {
		type: Number,
		index: true,
		unique: true
	},

	fcmRegistrationToken: {
		type: String
	},

	email: {
		type: String,
		required: true,
		unique: true,
		index: true
	},

	name: {
		type: String,
		required: true
	},

	photoURL: {
		type: String
	},

	pedaladas : {
		type : Number,
		default : 500
	},

	forms : [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Form'
	}],

	lastEntrance: {
		type : Date,
		default: new Date(1)
	}

});

module.exports = UserSchema;