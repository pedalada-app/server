'use strict';

var modelFactory = require('../models/factory');
var CompetitionRepository = require('./competition_repository');
var TeamRepository = require('./team_repository');
var repositoryUtils = require('./repository_utils');

var AbstractRepository = require('./abstract_repository');

var Rx = require('rx');

class FixtureConverter {

	constructor() {
		this.CompRepo = new CompetitionRepository();
		this.teamRepo = new TeamRepository()
	}

	from(obj) {
		return Rx.Observable.zip(
			Rx.Observable.fromPromise(this.CompRepo.idMapping(obj.competitionId)),
			Rx.Observable.fromPromise(this.teamRepo.idMapping(obj.homeTeamId)),
			Rx.Observable.fromPromise(this.teamRepo.idMapping(obj.awayTeamId)),
			function (compid, homeTeamId, awayTeamId) {
				return {
					api_detail: {
						id: obj.id
					},
					competitionId: compid,
					date: new Date(obj.date),
					status: obj.status,
					matchday: obj.matchday,
					homeTeam: {
						name: obj.homeTeamName,
						id: homeTeamId
					},
					awayTeam: {
						name: obj.awayTeamName,
						id: awayTeamId
					},
					result: {
						goalsHomeTeam: obj.result.goalsHomeTeam,
						goalsAwayTeam: obj.result.goalsAwayTeam
					},
					odds: obj.odds
				}
			}
		);
	}

}

class FixtureRepository {


	constructor() {
		this.absRep = new AbstractRepository(modelFactory.fixtureModel(), new FixtureConverter());
	}

	insert(obj) {
		return this.absRep.insert(obj);
	}

	insertMany(docs) {
		return this.absRep.insertMany(docs);
	}

	updateResult(fixtureId, result) {
		return this.absRep.update({_id: fixtureId}, repositoryUtils.setFieldValue({result: result}));
	}

	updateStatus(fixtureId, status) {
		return this.absRep.update({_id: fixtureId}, repositoryUtils.setFieldValue({status: status}));
	}

	updateDate(fixtureId, date) {
		return this.absRep.update({_id: fixtureId}, repositoryUtils.setFieldValue({date: date}));
	}

	updateOdds(fixtureId, odds) {
		return this.absRep.update({_id: fixtureId}, repositoryUtils.setFieldValue({odds: odds}));
	}

	updateFixture(fixtureId, result, status, odds) {
		return this.absRep.update({_id: fixtureId}, repositoryUtils.setFieldValue({
			result: result,
			status: status,
			odds: odds
		}));
	}

	getByApiId(apiId) {
		return repositoryUtils.getByApiId(this, apiId);
	}

	getByApiIds(apiIds) {
		return this.absRep.findAll({"api_detail.id": {$in: apiIds}});
	}

	getById(id) {
		return repositoryUtils.getById(this, id);
	}

	getByMatchDay(compId, matchday) {
		return this.absRep.findAll({$and: [{competitionId: compId}, {matchday: matchday}]}, {
			fixtureId: "$_id",
			date: "$date",
			result: "$result",
			homeTeam: "$homeTeam",
			awayTeam: "$awayTeam",
			odds: "$odds"
		}, {sort: 'date'});
	}

	idMapping(id) {
		return this.absRep.idMapping(id);
	}
}

module.exports = FixtureRepository;