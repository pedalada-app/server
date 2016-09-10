var chai = require('chai');

var expect = chai.expect;

var Queue = require('../../src/import/queue');

var createJob = function (job) {
    return {
        start: job
    };
};

describe("Queue test", function () {

    it("One job", function (done) {

        let q = new Queue(1, 100);

        q.addJob(createJob(function () {
            done();
        }));

        q.start();

    });

    it("Adding job async", function (done) {

        let q = new Queue(1, 100);

        let i = 0;

        q.addJob(createJob(function (qu) {

            setTimeout(function () {
                qu.addJob(createJob(function () {

                    done();

                }));
            }, 200);

        }));

        q.start();

    });

    it("Job adding another sync", function (done) {

        let q = new Queue(1, 100);

        let i = 0;

        q.addJob(createJob(function (qu) {

            i++;

            qu.addJob(createJob(function () {

                i++;

                setTimeout(function () {

                    expect(i).to.be.equal(2);

                    done();

                }, 200)

            }));

        }));

        q.start();

    });

});