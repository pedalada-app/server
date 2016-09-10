var Rx = require('rx');

module.exports.getByApiId = function(rep, apiId) {
    return Rx.Observable.fromPromise(rep.absRep.findOne({api_detail : {id : apiId}}));
};

module.exports.getById = function(rep, id) {
    return Rx.Observable.fromPromise(rep.absRep.findOne({_id : id}));
};