var Rx = require('rx');

class AbstractRepository {

    constructor(model, converterFactory) {
        this.model = model;
    }

    insert(obj) {
        return this.model.create(obj);
    }

    updateDocs(conditions, doc, options) {
        return this.model.update(conditions, doc, options);
    }

    update(conditions, doc) {
        var options = {
            overwrite : false
        };
        return this.updateDocs(conditions, doc, options);
    }

    updateMany(conditions, doc) {

        var options = {
            overwrite : true,
            multi: true
        };
        return this.updateDocs(conditions, doc, options);
    }

    delete(id) {
        return this.model.remove({_id : id});
    }

    findOne(query, projection) {
        return this.model.findOne(query, projection);
    }

    findAll(query, projection) {
        return this.model.find(query, projection);
    }

    idMapping(id) {
        return this.model.findOne()
            .where("api_detail.id").equals(id)
            .lean()
            .then(function (obj) {
                return Promise.resolve(obj._id);
        });
    }

}

module.exports = AbstractRepository;