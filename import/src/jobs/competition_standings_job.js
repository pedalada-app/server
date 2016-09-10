let config = require('../config');

let Client = require('football-api-client')(config.apiKey);


let Rx = require('rx');

let StandingRepository = require(config.dbLib).StandingRepository;
let CompetitionRepository = require(config.dbLib).CompetitionRepository;

let standingRepo = new StandingRepository();
let compRepo = new CompetitionRepository();

class CompetitionStandingsJob {

    constructor(competition, matchday) {
        this.competition = competition;
        this.matchday = matchday || 1;
    }

    start(queue) {

        let self = this;

        if (self.matchday > self.competition.currentMatchday) {
            return;
        }

        console.log("CompetitionStandingsJob comp=[" + self.competition.name + "], matchday = [" + self.matchday + "]")

        Rx.Observable.fromPromise(Client.getCompetitionById(this.competition.api_detail.id).getTable(this.matchday))
            .map(function (res) {
                return res.data;
            })
            .flatMap(function (standings) {

                standings.competitionId = self.competition.api_detail.id;
                return standingRepo.insert(standings);
            })
            .subscribe(function (standing) {

                if (self.competition.currentMatchday === self.matchday) {

                    console.log("Updating comp matchday");

                    compRepo.updateStanding(self.competition._id, standing._id)
                        .then(function () {
                            console.log("Updated competition match day");
                        })
                        .catch(function (err) {
                            console.error(err);
                        })
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