'use strict';
var config = require('../config');
var client = require('football-api-client')(config.apiKey);

var factory = require('../../../db/src/main/repositories/factory');
var HandlerFactory = require('../handlers/handler_factory');

var handler = new HandlerFactory();

var Rx = require('rx');

var createIdToFixtureMap = function (fixtures) {
    let map = {};
    for (let fixture of fixtures) {
        map[fixture.id] = fixture;
    }
    return map;
};

var fixtureChanged = function (updated, fromDb) {
    if (updated.status !== fromDb.status) {
        return true;
    }
    if (updated.result.goalsHomeTeam !== fromDb.result.goalsHomeTeam ||
        updated.result.goalsAwayTeam !== fromDb.result.goalsAwayTeam) {
        return true;
    }

    if (updated.odds) {
        if (!fromDb.odds) {
            return true;
        }

        if (updated.odds.homeWin !== fromDb.odds.homeWin ||
            updated.odds.awayWin !== fromDb.odds.awayWin ||
            updated.odds.draw !== fromDb.odds.draw) {
            return true;
        }
    }

    return false;
};

module.exports = function () {
    console.log("fixture job begin");

    Rx.Observable.zip(
        Rx.Observable.fromPromise(client.getFixtures({timeFrame: 'p1'})),
        Rx.Observable.fromPromise(client.getFixtures({timeFrame: 'n1'})),
        function (changeYesterday, todayAndTomorrow) {
            changeYesterday = changeYesterday.data.fixtures;
            todayAndTomorrow = todayAndTomorrow.data.fixtures;

            return createIdToFixtureMap(changeYesterday.concat(todayAndTomorrow));
        })
        .flatMap(function (idToFixtureMap) {
            return factory.fixtureRepo().getByApiIds(Object.keys(idToFixtureMap))
                .map(function (dbFixtures) {
                    return {
                        dbFixtures: dbFixtures,
                        idToFixtureMap: idToFixtureMap
                    }
                })
        })
        .subscribe(function (map) {
            let changedFixtures = [];
            for (let dbFixture of map.dbFixtures) {
                var newFixture = map.idToFixtureMap[dbFixture.api_detail.id];
                if (fixtureChanged(newFixture, dbFixture)) {
                    newFixture._id = dbFixture._id;
                    changedFixtures.push(newFixture);
                }
            }
            handler.getHandler("Fixture", changedFixtures);
        });
}