var Rx = require('rx');

module.exports.getByMail = function (rep, email) {
	return rep.absRep.findOne({email: email}).lean();
};

module.exports.getById = function (rep, id) {
	return Rx.Observable.fromPromise(rep.absRep.findOne({_id: id}));
};

module.exports.setFieldValue = function (field) {
	return {$set: field};
};
