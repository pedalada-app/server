var express = require('express');
var router = express.Router();
var utils = require('./router_utils');

var Rx = require('rx');

var RepositoryFactory = require('../../../db/src/main/repositories/factory');
var compRepo = RepositoryFactory.competitionRepo();
var fixtRepo = RepositoryFactory.fixtureRepo();

// check if pass authentication
router.use(function (req, res, next) {
    if (req.authenticate.error) {
        console.error(req.authenticate.error);
        res.status(401);
        res.json({msg: "authentication failed", error: req.authenticate.error})
    } else {
        res.userId = res.authenticate.decoded;
        next();
    }
});

// get all league names
router.get(function (req, res, next) {
    compRepo.getAll()
        .then(function (comps) {
            let returnComps = [];
            for (let comp of comps) {
                returnComps.push({
                    compId: comp._id,
                    name: comp.name,
                    logo: comp.competitionLogoUrl,
                    matchday: comp.currentMatchday
                })
            }
            res.status(200);
            res.json(returnComps);
        })
        .catch(utils.errorHandler(res))
});

// get all current matchday fixtures of given competitions
router.get('/fixtures', function (req, res, next) {
    let comps = req.query.compIds;
    if (comps) {
        let compIds = comps.split(',');
        Rx.Observable.from(compIds)
            .flatMap(function (compId) {
                return compRepo.getById(compId)
            })
            .flatMap(function (comp) {
                return fixtRepo.getByMatchDay(comp._id, comp.currentMatchday)
                    .map(function (fixtures) {
                        return {
                            competitionId: comp._id,
                            currentMatchday: comp.currentMatchday,
                            fixtures: fixtures
                        };
                    })
            })
            .toArray()
            .subscribe(function (arr) {
                res.status(200);
                res.json(arr);
            })

    } else {
        console.error("competitions ID's doesn't sent");
        res.status(400);
        res.json({msg: "competitions ID's doesn't sent"})
    }

});