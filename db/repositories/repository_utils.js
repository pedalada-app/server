module.exports.getByApiId = function(rep, apiId) {
    return rep.absRep.findOne({api_detail : {id : apiId}});
};

module.exports.getById = function(rep, id) {
    return rep.absRep.findOne({_id : id});
};