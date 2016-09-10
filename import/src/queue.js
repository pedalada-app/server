class Queue {


    constructor(limit, timeInterval) {

        this.tokensInInterval = limit;
        this.tokensLeftInInterval = limit;
        this.timeInterval = timeInterval;

        this.jobs = [];
        this.pending = [];

        this.active = false;

    }

    start() {

        console.log("start");

        let self = this;

        if (self.active) {
            return;
        }

        self.active = true;

        self.startTimer();
        self.nextJob();


    }

    addJob(job) {

        console.log("addJob");

        let self = this;

        self.jobs.push(job);

        if (!self.active) {
            self.start();
        }

    }

    jobWrapper(job) {

        let self = this;

        return function () {

            console.log("jobWrapper");

            if (self.tokensLeftInInterval > 0) {

                self.tokensLeftInInterval--;

                job.start(self);

                self.nextJob();

            } else {

                self.pending.push(self.jobWrapper(job));

            }
        }
    }


    nextJob() {

        console.log("nextJob");

        var self = this;

        if (self.jobs.length > 0) {

            let job = self.jobs.pop();

            self.jobWrapper(job)();

        } else {

            self.cleanUp();

        }
    }

    startTimer() {

        console.log("startTimer");

        let self = this;

        self.timer = setTimeout(function () {

            self.tokensLeftInInterval = self.tokensInInterval;

            for (let pendingJob of self.pending) {

                if (self.tokensLeftInInterval > 0) {

                    pendingJob();

                }

            }

        }, self.timeInterval);

    }

    cleanUp() {

        console.log("cleanUp");


        let self = this;

        self.pending.push(function () {

            if (!self.active) {

                clearInterval(self.timer);

            }

        });

        self.active = false;

    }
}

module.exports = Queue;