"use strict";

var factory = require('../../../../db/src/main/repositories/factory');

var Rx = require('rx');

var createIdToCompetitionMap = function (competitions) {
	let map = {};
	for (let comp of competitions) {
		map[comp.id] = comp;
	}
	return map;
};

class CompetitionUpdateHandler {

    handle(competitions) {
		let idToCompMap = createIdToCompetitionMap(competitions);
    	let apiIds = [];
		for (let comp of competitions) {
			apiIds.push(comp.id);
		}

		factory.competitionRepo().getByApiIds(apiIds)
			.flatMap(function (comps) {
				return Rx.Observable.from(comps)
			})
			.flatMap(function (comp) {
				return Rx.Observable.fromPromise(factory.competitionRepo().updateMatchDay(comp._id, idToCompMap[comp.api_detail.id].currentMatchday));
			})
			.subscribe(function () {
				console.log("current matchday of a competition has changed");
			})
    }

}

module.exports = CompetitionUpdateHandler;