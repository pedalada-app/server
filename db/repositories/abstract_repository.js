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
        let convertedDocs = [];
        for (let doc of docs) {
            convertedDocs.push(this.converterFactory.from(doc));
        }
        return this.model.insertMany(convertedDocs);
    }

    update(conditions, doc) {
        var options = {
            overwrite : true
        };
        return this.model.update(conditions, doc, options, function(err) {
            console.log("can't update");
        });
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
            return obj._id;
        });
    }

}

module.exports = AbstractRepository;