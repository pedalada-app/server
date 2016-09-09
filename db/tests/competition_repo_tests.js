var chai = require('chai');
var compRepo = require('../repositories/competition_repository');
var mongoose = require('mongoose');
var competiton = require('../models/competition');

var Rx = require('Rx');

var expect = chai.expect;


var assertFalse = function () {
    expect(false).to.be.true;
};
describe('Compatition Repository test', function() {

    beforeEach(function(done) {
        if(mongoose.connection.db) {
            return done();
        }
        mongoose.connect('mongodb://localhost/pedaladaDb', done);
    });

    it('insert', function(done) {
        var comp = {
            id: 426,
            caption: "Premier League 2016/17",
            league: "PL",
            year: "2016",
            currentMatchday: 4,
            numberOfMatchdays: 38,
            numberOfTeams: 20,
            numberOfGames: 380,
            lastUpdated: "2016-09-09T00:00:22Z"
        };

        compRepo.insert(comp)
            .flatMap(function(obj) {


                return Rx.Observable.fromPromise(competiton.findOne({_id : obj._id}));

            })
            .subscribe(function(returnComp) {

                console.log(returnComp);

                if(returnComp) {
                    done()
                } else {
                    assertFalse();
                }
            }, function (error) {

                console.error(error);

                assertFalse();
            });

    });

});