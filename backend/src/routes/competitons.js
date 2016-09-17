var express = require('express');
var router = express.Router();
var utils = require('./router_utils');

var RepositoryFactory = require('../../../db/src/main/repositories/factory');
var compRepo = RepositoryFactory.competitionRepo();

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
        let fixtures = [];
        for (let compId of compIds) {

        }
    } else {
        console.error("competitions ID's doesn't sent");
        res.status(500);
        res.json({msg: "competitions ID's doesn't sent"})
    }

});