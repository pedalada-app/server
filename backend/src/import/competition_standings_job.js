let Client = require('football-api-client')('');

let Rx = require('rx');

let StandingRepository = require('dbLib').StandingRepository;
let CompetitionRepository = require('dbLib').CompetitionRepository;

let standingRepo = new StandingRepository();
let compRepo = new CompetitionRepository();

class CompetitionStandingsJob {

    constructor(competition, matchday) {
        this.competition = competition;
        this.matchday = matchday || 1;
    }

    start(queue) {

        if (this.matchday > this.competition.currentMatchday) {
            return;
        }

        let self = this;

        Rx.Observable.fromPromise(Client.getCompetitionById(this.competition._id).getTable(this.matchday))
            .flatMap(function (standings) {
                standings.competitionId = self.competition.api_detail.id;
                return standingRepo.insert(standings);
            })
            .subscribe(function (standing) {

                if (self.competition.matchday === self.matchday) {
                    compRepo.updateStanding(self.competition._id, standing._id);
                } else {
                    let standingsJob = new CompetitionStandingsJob(self.competition, self.matchday + 1);
                    queue.addJob(standingsJob);
                }

            }, function (err) {
                console.error(err);
            });


    }

}

module.exports = CompetitionStandingsJob;