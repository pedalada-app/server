'use strict';

var Rx = require('rx');

class AbstractRepository {

    constructor(model, converterFactory) {
        this.model = model;
        this.converterFactory= converterFactory;
    }

    insert(obj) {

        let source = this.converterFactory.from(obj);

        let that = this;

        return source.flatMap(function (obj) {
            return Rx.Observable.fromPromise(that.model.create(obj));
        })

    }

    insertMany(docs) {
        let convertedDocsObs = [];
        for (let doc of docs) {
            convertedDocsObs.push(this.converterFactory.from(doc));
        }

        let that = this;

        return Rx.Observable.zip(convertedDocsObs)
            .flatMap(function (convertedDocs) {
                return Rx.Observable.fromPromise(that.model.insertMany(convertedDocs));
            })
    }

    updateDocs(conditions, doc, options) {
        return this.model.update(conditions, doc, options);
    }

    update(conditions, doc, options) {
        options = options || {};
		options.overwrite = options.overwrite || false;

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