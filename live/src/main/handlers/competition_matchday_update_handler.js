"use strict";

var factory = require('../../../db/src/main/repositories/factory');

var Rx = require('rx');

var createIdToCompetitionMap = function (competitions) {
	let map = {};
	for (let comp of competitions) {
		map[comp.id] = comp;
	}
	return map;
};

class CompetitionUpdateHandler {

	constructor() {
		factory.init();
	}

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
			.subscribe(function (comp) {
				let newCurrentMatchday = idToCompMap[comp.api_detail.id].currentMatchday;
				if (comp.currentMatchday !== newCurrentMatchday) {
					Rx.Observable.fromPromise(factory.competitionRepo().updateMatchDay(comp._id, newCurrentMatchday))
						.subscribe(function () {
							console.log("current matchday of " + comp.name + " has updated");
						})
				} else {
					console.log("current matchday of " + comp.name + " is updated already");
				}

			})
	}
}

module.exports = CompetitionUpdateHandler;