var chai = require('chai');
var compRepo = require('../repositories/competition_repository');
var mongoose = require('mongoose');
var competiton = require('../models/competition');

var expect = chai.expect;


describe('Compatition Repository test', function() {

    beforeEach(function(done) {
        if(mongoose.connection.db) {
            return done();
        }
        mongoose.connect('mongodb://localhost/pedaladaDb', done);
    });

    it('insert', function(done) {
        var comp = {
            "id": 394,
            "caption": "1. Bundesliga 2015/16",
            "league": "BL1",
            "year": "2015",
            "numberOfTeams": 18,
            "numberOfGames": 306,
            "lastUpdated": "2015-10-25T19:06:29Z"
        };

        compRepo.insert(comp)
            .then(function(id) {
                return competiton.findOne({id : id});

            })
            .then(function(returnComp) {
                if(returnComp) {
                    done()
                } else {
                    expect(false).to.be.true;
                }
            });

    });

});