class AbstractRepository {

    constructor(model, converterFactory) {
        this.model = model;
        this.converterFactory= converterFactory;
    }

    insert(obj) {
        let obj = this.converterFactory.from(obj);

        return this.model.create(obj);
    }

    update() {

    }

    deldete() {

    }

    find() {

    }

}