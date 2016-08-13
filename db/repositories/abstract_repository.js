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

    update() {

    }

    deldete() {

    }

    find() {

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